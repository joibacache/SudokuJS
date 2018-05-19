function TableroSudoku(canvasContenedor,colorFondo,colorCursor)
{
    this.colorFondo = colorFondo;
    this.colorCursor = colorCursor;
    this.celdas = {};
    this.columnas = {};
    this.canvas = document.getElementById(canvasContenedor);
    this.ctxGr = this.canvas.getContext("2d");
    this.cursor = new Cursor(colorCursor);
    
    //Dibuja la cuadricula y el cursor en su posición inicial.
    this.dibujaTablero = function()
    {
        // primero pintamos el fondo
        this.colorFiguraTexto(this.colorFondo);
        this.ctxGr.fillRect(0, 
                        0,
                        this.canvas.width,
                        this.canvas.height);

        //luego dibujamos la grilla
        //límite externo
        this.ctxGr.strokeRect(this.dimensiones.margen.ancho,
                            this.dimensiones.margen.alto,
                            this.dimensiones.tablero.ancho,
                            this.dimensiones.tablero.alto);
        
        //celdas y cuadrantes
        this.colorLinea(this.colorCursor);        
        for (i = 1; i < 10; i++)
        {
            this.anchoLinea(1);
            for (j = 1; j < 10; j++)
            {
                this.anchoLinea(1);
                this.ctxGr.strokeRect(this.dimensiones.margen.ancho + (this.dimensiones.celda.ancho * (i - 1)), 
                                    this.dimensiones.margen.alto + (this.dimensiones.celda.alto * (j - 1)), 
                                    this.dimensiones.celda.ancho,
                                    this.dimensiones.celda.alto);
                if ((i % 3 == 1) && (j % 3 == 1))
                {
                    this.anchoLinea(3);
                    this.ctxGr.strokeRect(this.dimensiones.margen.ancho + (this.dimensiones.celda.ancho * (i - 1)), 
                                            this.dimensiones.margen.alto + (this.dimensiones.celda.alto * (j - 1)),
                                            this.dimensiones.celda.ancho * 3,
                                            this.dimensiones.celda.alto * 3);
                }
            }
        }
        this.actualizaPosicionCursor(false);
    }

    this.controladorInputs = function(keyCode)
    {
        if(this.cursor.mover(keyCode))
            this.actualizaPosicionCursor(true);
    };

    this.actualizaPosicionCursor = function(borraPosicionAnterior)
    {
        this.colorFiguraTexto(this.colorCursor);
        this.ctxGr.fillRect((this.cursor.coordenada.x*this.dimensiones.celda.ancho)-this.dimensiones.margen.ancho,
                            (this.cursor.coordenada.y*this.dimensiones.celda.alto)-this.dimensiones.margen.alto,
                            this.dimensiones.celda.ancho,
                            this.dimensiones.celda.ancho);
        
        if(borraPosicionAnterior)
        {
            this.colorFiguraTexto(this.colorFondo);
            this.ctxGr.fillRect((this.cursor.coordenadaAnt.x*this.dimensiones.celda.ancho)-this.dimensiones.margen.ancho,
                                (this.cursor.coordenadaAnt.y*this.dimensiones.celda.alto)-this.dimensiones.margen.alto,
                                this.dimensiones.celda.ancho,
                                this.dimensiones.celda.ancho);
            this.anchoLinea(1);
            this.colorLinea(colorCursor);
            this.ctxGr.strokeRect((this.cursor.coordenadaAnt.x*this.dimensiones.celda.ancho)-this.dimensiones.margen.ancho,
                                (this.cursor.coordenadaAnt.y*this.dimensiones.celda.alto)-this.dimensiones.margen.alto,
                                this.dimensiones.celda.ancho,
                                this.dimensiones.celda.ancho);
        }
    }
    
    this.colorLinea = function(color)
    {
        this.ctxGr.strokeStyle = color;
    }
    
    this.colorFiguraTexto = function(color)
    {
        this.ctxGr.fillStyle = color;
    };

    this.anchoLinea = function(pxs)
    {
        this.ctxGr.lineWidth = pxs;
    };

    this.dimensiones ={
        contenedor:{
            alto : this.canvas.height,
            ancho : this.canvas.width
        },
        margen: {
            alto:(this.canvas.height/10)/2,
            ancho:(this.canvas.width/10)/2},
        celda:{
            alto:this.canvas.width/10,
            ancho:this.canvas.height/10},
        tablero:{
            alto:(this.canvas.width/10) * 9,
            ancho:(this.canvas.height/10) * 9}
    };

    this.inicializarFilas = function()
    {
        for(i=1;i<10;i++)
        for(j=1;j<10;j++)
            this.celdas[i+','+j] = 0;
    }

    this.despliegaNumeros = function()
    {
        var indices = Object.keys(this.celdas);
        for(i=0;i<indices.length;i++)
        {
            console.log(indices[i]);

        }
    }
}


function Cursor(color)
{
    this.color = color;
    this.flechas =
    {
        IZQ : 37,
        ARR : 38,
        DER : 39,
        ABA : 40,
    }

    this.coordenada = new Coordenada(1,1);
    this.coordenadaAnt;

    this.traducirKeyCodeDelta = function(keyCode){
        this.x=0,this.y=0;
        switch (keyCode) {
            case this.flechas.IZQ:
                this.x--;
                break;
            case this.flechas.ARR:
                this.y--;
                break;
            case this.flechas.ABA:
                this.y++;
                break;
            case this.flechas.DER:
            this.x++;
                break;
            default:
                return undefined;
        }
        return {x:this.x,y:this.y};
    }

    this.mover = function(keyCode) //dX,dY)
    {
        this.delta = this.traducirKeyCodeDelta(keyCode);
        if(this.delta == undefined)
            return false;
            
        //Izquierda
        if(this.delta.x<0 && this.coordenada.x>1)
        {
            this.coordenadaAnt = new Coordenada(this.coordenada.x,this.coordenada.y);
            this.coordenada.x--;
        }
        //Derecha
        if(this.delta.x>0 && this.coordenada.x<9)
        {
            this.coordenadaAnt = new Coordenada(this.coordenada.x,this.coordenada.y);
            this.coordenada.x++;
        }
        //Arriba
        if(this.delta.y<0 && this.coordenada.y>1)
        {
            this.coordenadaAnt = new Coordenada(this.coordenada.x,this.coordenada.y);
            this.coordenada.y--;
        }
        //Abajo
        if(this.delta.y>0 && this.coordenada.y<9)
        {
            this.coordenadaAnt = new Coordenada(this.coordenada.x,this.coordenada.y);
            this.coordenada.y++;
        }
        return true;
    };
}

function Coordenada(x,y)
{
    this.x = x;
    this.y = y;
}