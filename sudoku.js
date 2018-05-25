function TableroSudoku(canvasContenedor,colorFondo,colorCursor)
{
    this.colorFondo = colorFondo;
    this.colorCursor = colorCursor;
    this.colorValorCursor = "red";
    this.celdas = [];
    this.celdasBT = [];    
    this.celdasNulas = [];
    for(i=1;i<10;i++)
        for(j=1;j<10;j++)
            this.celdasNulas[i+','+j] = undefined;
    this.columnas = {};
    this.canvas = document.getElementById(canvasContenedor);
    this.ctxGr = this.canvas.getContext("2d");
    this.cursor = new Cursor(colorCursor);
    this.limpiaPosicionAnterior = true;
    this.VALOR_AUTOGENERADO = 1;
    this.TOTAL_CASILLAS = 81;
    this.NUM_CELDAS_INICIALES = 81;
    this.MAX_INTENTOS_ALEATORIOS = 30;
    this.genNumerico = new GeneradorNumerico();

    
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
    }

    this.controladorInputs = function(keyCode)
    {
        if(this.cursor.mover(keyCode))
            this.actualizaPosicionCursor(true);
    };

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

    this.actualizaPosicionCursor = function(limpiaPosicionAnterior)
    {
        this.pintaCursor();
        if(this.celdas[this.cursor.coordenada.llave()]!=undefined)
        {    
            // console.log(this.celdas[this.cursor.coordenada.llave()].split(',')[0])
            this.pintaValorCelda(this.cursor.coordenada.x,this.cursor.coordenada.y,this.celdas[this.cursor.coordenada.llave()].split(',')[0],true);
        }
        if(limpiaPosicionAnterior)
        {
            this.borraCursorPosicionAnterior();
            if(this.celdas[this.cursor.coordenadaAnt.llave()]!=undefined)
                this.pintaValorCelda(this.cursor.coordenadaAnt.x,this.cursor.coordenadaAnt.y,this.celdas[this.cursor.coordenadaAnt.llave()].split(',')[0],false);       
            
        }
    }

    this.inicializarFilas = function()
    {
        var cont = 0;
        var contBT = 0;
        if(Object.keys(this.celdas).length == this.TOTAL_CASILLAS)
            return false;

        while(cont<this.NUM_CELDAS_INICIALES)
        {
            // console.log('cont:'+cont);
            var key = this.obtenerCoordCeldaVacia(this.celdas);
            valores = this.obtenerNumerosDisponiblesCelda(key);
            var indice = Math.floor(Math.random()*(valores.length));
            valor = valores[indice];
            if(valor != undefined)
            {
                this.celdasBT.push({k:key,v:valor});
                this.celdas[key.x+','+key.y] = valor + ',' + this.VALOR_AUTOGENERADO
                this.pintaValorCelda(key.x,key.y,valor,false);       
                cont++;
            }
            else
            {
                contBT++;
                if(contBT == 20)
                {
                    this.celdas = [];
                    for(i = 1;i<10;i++)
                    {
                        for(j=1;j<10;j++)
                        {
                            coordAux = new Coordenada(i,j);
                            this.borraContenidoCelda(coordAux);
                        }
                    }
                    cont = 0;
                    contBT = 0;
                    console.log("Reinicia tablero");
                    continue;
                }
                for(i=1;i<key.y;i++)
                {
                    delete this.celdas[key.x+','+i];
                    coordAux = new Coordenada(key.x,i);
                    this.borraContenidoCelda(coordAux);
                    cont--;
                }
            }
        }
    }

    this.obtenerCoordCeldaVacia = function(celdasUtilizadas)
    {
        var indicesCeldasNulas = Object.keys(this.celdasNulas);
        var indicesCeldasUtilizadas = celdasUtilizadas == undefined ? []:Object.keys(celdasUtilizadas);
        var indicesCeldasDisponibles = indicesCeldasNulas.filter(x=>indicesCeldasUtilizadas.indexOf(x)==-1);

        // var coordAle;
        // do
        // {
        //     coordAle = Math.floor(Math.random() * (indicesCeldasDisponibles.length-1));
        // } while(coordAle > indicesCeldasDisponibles.length)
        
        // var coord = indicesCeldasDisponibles[coordAle].split(',');
        var coord = indicesCeldasDisponibles[0].split(',');
        return {x:parseInt(coord[0]),y:parseInt(coord[1])};
    }

    this.despliegaNumeros = function()
    {
        var indices = Object.keys(this.celdas);
        for(i=0;i<indices.length;i++)
        {
            console.log(indices[i]);
        }
    }

    this.pintaCursor = function()
    {
        this.colorFiguraTexto(this.colorCursor);
        this.ctxGr.fillRect((this.cursor.coordenada.x*this.dimensiones.celda.ancho)-this.dimensiones.margen.ancho,
                            (this.cursor.coordenada.y*this.dimensiones.celda.alto)-this.dimensiones.margen.alto,
                            this.dimensiones.celda.ancho,
                            this.dimensiones.celda.ancho);
    }
    
    this.pintaValorCelda = function(x,y,valor,esCursor)
    {
        this.ctxGr.font = "12px Arial";
        if(esCursor)
            this.ctxGr.fillStyle = this.colorValorCursor;
        else
            this.ctxGr.fillStyle = this.colorCursor;
        this.ctxGr.fillText(valor,
                            (x*this.dimensiones.celda.ancho)-3,
                            (y*this.dimensiones.celda.alto)+5);
    }

    this.borraCursorPosicionAnterior = function()
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
        
        var coordsCuadrante = this.cursor.coordenadaAnt.obtenerCuadranteCoordenada();
        this.anchoLinea(3);
        this.ctxGr.strokeRect((coordsCuadrante.x*this.dimensiones.celda.ancho)-this.dimensiones.margen.ancho,
                            (coordsCuadrante.y*this.dimensiones.celda.alto)-this.dimensiones.margen.alto,
                            this.dimensiones.celda.ancho*3,
                            this.dimensiones.celda.ancho*3);
    }

    this.borraContenidoCelda = function(coord)
    {
        this.colorFiguraTexto(this.colorFondo);
        this.ctxGr.fillRect((coord.x*this.dimensiones.celda.ancho)-this.dimensiones.margen.ancho,
                            (coord.y*this.dimensiones.celda.alto)-this.dimensiones.margen.alto,
                            this.dimensiones.celda.ancho,
                            this.dimensiones.celda.ancho);
        this.anchoLinea(1);
        this.colorLinea(colorCursor);
        this.ctxGr.strokeRect((coord.x*this.dimensiones.celda.ancho)-this.dimensiones.margen.ancho,
                            (coord.y*this.dimensiones.celda.alto)-this.dimensiones.margen.alto,
                            this.dimensiones.celda.ancho,
                            this.dimensiones.celda.ancho);
        
        var coordsCuadrante = coord.obtenerCuadranteCoordenada();
        this.anchoLinea(3);
        this.ctxGr.strokeRect((coordsCuadrante.x*this.dimensiones.celda.ancho)-this.dimensiones.margen.ancho,
                            (coordsCuadrante.y*this.dimensiones.celda.alto)-this.dimensiones.margen.alto,
                            this.dimensiones.celda.ancho*3,
                            this.dimensiones.celda.ancho*3);
    }

    this.obtenerNumerosDisponiblesCelda = function(coord)
    {
        var x = coord.x;
        var y = coord.y;
        var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        var numsExistentes=[];
        for(i = 1;i<10;i++)
        {
            indX = x+','+i;
            // console.log(indX);
            if(this.celdas[indX]!=undefined)
                if(numsExistentes.indexOf(parseInt(this.celdas[indX].split(',')[0])) == -1)
                    numsExistentes.push(parseInt(this.celdas[indX].split(',')[0]));
            
            indY = i+','+y;
            // console.log(indY);
            if(this.celdas[indY]!=undefined)
                if(numsExistentes.indexOf(parseInt(this.celdas[indY].split(',')[0])) == -1)
                    numsExistentes.push(parseInt(this.celdas[indY].split(',')[0]));
        }
        var cuadrante = this.cursor.coordenada.obtenerCuadranteCoordenadaXY(x,y);
        for(i = 0;i<3;i++)
        {
            for(j=0;j<3;j++)
            {
                key = (cuadrante.x+i)+','+(cuadrante.y+j);
                if(this.celdas[key]!=undefined)
                    if(numsExistentes.indexOf(parseInt(this.celdas[key].split(',')[0])) == -1)
                        numsExistentes.push(parseInt(this.celdas[key].split(',')[0]));
            }
        }

        var salida = nums.filter(x=>(numsExistentes.indexOf(x)==-1));
        // console.log('['+x+','+y+']' + salida);

        return salida;
    }


    this.limpiarCeldas = function()
    {
        var cont = 0;
        while(cont<25)
        {
            var coord = this.genNumerico.obtenerCoordenadaAleatoria();
            this.borraContenidoCelda(coord);
            cont++;
        }
    }



    var startTime = new Date();

    this.dibujaTablero();
    this.inicializarFilas();

    var endTime = new Date();
    var timeDiff = endTime - startTime;

    timeDiff /= 1000;

    console.log('time: '+timeDiff);


    
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

    this.mover = function(keyCode)
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
    //Retorna un objeto coordenada, pero sin la función obtenerCuadranteCoordenada para evitar posibles ciclos infinitos
    this.obtenerCuadranteCoordenada = function()
    {
        var cX = (Math.ceil(this.x/3)*3)-2;
        var cY = (Math.ceil(this.y/3)*3)-2;

        var coord = new Coordenada(cX,cY);
        delete coord.obtenerCuadranteCoordenada;
        return coord;
    }

    this.obtenerCuadranteCoordenadaXY = function(x,y)
    {
        var cX = (Math.ceil(x/3)*3)-2;
        var cY = (Math.ceil(y/3)*3)-2;

        var coord = new Coordenada(cX,cY);
        delete coord.obtenerCuadranteCoordenada;
        return coord;
    }

    this.llave =  function(){return this.x+','+this.y;};
}

function GeneradorNumerico()
{
    this.generarCoordenadaAleatoria = function ()
    {
        coordAle = 0;
        while((coordAle < 1) || (coordAle > 9))
        {
            coordAle = Math.floor(Math.random() * 9);
        }
        return coordAle;
    };
    this.obtenerCoordenadaAleatoria = function()
    {
        var x = this.generarCoordenadaAleatoria();
        var y = this.generarCoordenadaAleatoria();
        
        var coords = new Coordenada(x,y);
        // delete coords.obtenerCuadranteCoordenada;
        return coords;

    };
}