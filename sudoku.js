function TableroSudoku(canvasContenedor)
{
    this.celdas = {};
    this.columnas = {};
    this.canvas = document.getElementById(canvasContenedor);
    this.ctxGr = this.canvas.getContext("2d");
    
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

    this.contenedor = 
    {
        dimensiones : {
                ancho : this.canvas.width,
                alto : this.canvas.height
    }};
    this.dimensiones = 
    {
        margen: {
            x:(this.contenedor.dimensiones.ancho/10)/2,
            y:(this.contenedor.dimensiones.alto/10)/2},
        celda:{
            alto:this.contenedor.dimensiones.alto/10,
            ancho:this.contenedor.dimensiones.ancho/10},
        tablero:{
            alto:(this.contenedor.dimensiones.alto/10) * 9,
            ancho:(this.contenedor.dimensiones.ancho/10) * 9}
    };

    this.dibujaTablero = function()
    {
        // primero pintamos el fondo
        // this.gr.colorFiguraTexto("lightblue");
        this.colorFiguraTexto("lightblue");
        this.ctxGr.fillRect(0, 
                        0,
                        this.contenedor.dimensiones.ancho,
                        this.contenedor.dimensiones.alto);

        //luego dibujamos la grilla
        //límite externo
        this.ctxGr.strokeRect(this.dimensiones.margen.x,
                            this.dimensiones.margen.y,
                            this.dimensiones.tablero.ancho,
                            this.dimensiones.tablero.alto);
        
        //celdas y cuadrantes
        // this.gr.colorLinea("black");
        this.colorLinea("black");        
        for (i = 1; i < 10; i++)
        {
            // this.gr.anchoLinea(1);
            this.anchoLinea(1);
            for (j = 1; j < 10; j++)
            {
                this.anchoLinea(1);
                this.colorLinea("black");
                this.ctxGr.strokeRect(this.dimensiones.margen.x + (this.dimensiones.celda.ancho * (i - 1)), 
                                    this.dimensiones.margen.y + (this.dimensiones.celda.alto * (j - 1)), 
                                    this.dimensiones.celda.ancho,
                                    this.dimensiones.celda.alto);
                if ((i % 3 == 1) && (j % 3 == 1))
                {
                    // this.gr.anchoLinea(3);
                    // this.gr.colorLinea("black");
                    this.anchoLinea(3);
                    this.colorLinea("black");
                    this.ctxGr.strokeRect(this.dimensiones.margen.x + (this.dimensiones.celda.ancho * (i - 1)), 
                                            this.dimensiones.margen.y + (this.dimensiones.celda.alto * (j - 1)),
                                            this.dimensiones.celda.ancho * 3,
                                            this.dimensiones.celda.alto * 3);
                }
            }
        }
    }

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

