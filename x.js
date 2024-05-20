var RandomColorGenerator = (function(){

    function Generator( object ){
        var self = this, i;
    
        if ( ! self instanceof Generator ) {
            return new Generator( object );
        }
    
        self.defaults = {
            predef: [],
    
            rangeMax: 255,
            rangeMin: 0,
    
            levelUp: -1,
            levelDown: 256,
    
            recursionLimit: 15,
            recursion: function(){
                throw 'Recursion Error in Random Color Generator, ' +
                    'too many tries on finding random color, ' +
                    '[Limit ' + this.recursionLimit + ']';
            }
        };
    
        self.stack = {};
    
        if ( object && typeof object === 'object' ) {
            for ( i in object ) {
                if ( object.hasOwnProperty(i) ) {
                    self.defaults[i] = object[i];
                }
            }
        }
    }
    
    
    Generator.prototype = {
    
        random: function( i ){
            var self = this,
                defaults = self.defaults,
                r = self.rand(),
                g = self.rand(),
                b = self.rand(),
                hex = self.rgb2hex( r, g, b ),
                levels = true;
    
            if ( typeof i !== 'number' ) {
                i = 0;
            }
            else if ( ++i > defaults.recursionLimit ) {
                return defaults.recursion();
            }
    
            if ( self.stack[ hex ] ) {
                hex = self.random(i);
            }
    
            levels = !!(
                ( r > defaults.levelUp || g > defaults.levelUp || b > defaults.levelUp ) &&
                ( r < defaults.levelDown || g < defaults.levelDown || b < defaults.levelDown )
            );
            if ( ! levels ) {
                hex = self.random(i);
            }
    
            self.stack[ hex ] = [ r,g,b ];
    
            return hex;
        },
    
        rand: function(){
            var defaults = this.defaults;
            return defaults.rangeMin + Math.floor( Math.random() * (defaults.rangeMax + 1) );
        },
    
        reset: function(){
            var self = this, predef = self.defaults.predef, l = predef.length, i = -1;
            self.stack = {};
            if ( l > 0 ) {
                for ( ; ++i < l ; ) {
                    self.stack[ predef[i] ] = self.hex2rgb( predef[i] );
                }
            }
        },
    
        rgb2hex: function( r, g, b ){
            var str = '0123456789ABCDEF';
            return '#' + [
                str.charAt( (r - r % 16) / 16) + str.charAt(r % 16),
                str.charAt( (g - g % 16) / 16) + str.charAt(g % 16),
                str.charAt( (b - b % 16) / 16) + str.charAt(b % 16)
            ].join('');
        },
    
        hex2rgb: function( hex ){
            var self = this;
    
            if ( hex.charAt(0) === '#' ) {
                hex = hex.substr(1);
            }
    
            return self.stack && self.stack[ '#' + hex ] ? self.stack[ '#' + hex ] : 
                hex.length === 6 ? [
                    parseInt( hex.substr(0, 2), 16 ),
                    parseInt( hex.substr(2, 2), 16 ),
                    parseInt( hex.substr(4, 2), 16 )
                ] : hex.length === 3 ? [
                    parseInt( hex.substr(0, 1), 16 ),
                    parseInt( hex.substr(1, 1), 16 ),
                    parseInt( hex.substr(2, 1), 16 )
                ] : [];
        }
    };
    
    Generator.rgb2hex = Generator.prototype.rgb2hex;
    Generator.hex2rgb = Generator.prototype.hex2rgb;
    
    return Generator;
    
    })();