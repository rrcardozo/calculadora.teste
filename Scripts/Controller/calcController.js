class CalcController{
    
    constructor(){

        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initKeyboard();
        this.inittButtonsEvents();
        this.addEventListenerAll;
        this._audioOnff = false;
        this._audio = new Audio('click.mp3');
    }

    pasteFromClipboard(){

        document.addEventListener('paste', e=>{

           let text = e.clipboardData.getData('Text');

           this.displayCalc = parseFloat(text);

           console.log(text);

        })

    }

    copyToClipboard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("copy");

        input.remove(); /* removendo porque a imagem é em svg */

    }


   

    initialize(){

        this.setdisplayDateTime();

        setInterval(() => {
            this.setdisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn=>{

            btn.addEventListener('dblclick', e=>{

                this.toggleAudio();
            })
        })
   

    }

    toggleAudio(){

        this._audioOnff = !this._audioOnff;

    }

    playAudio(){

        if (this._audioOnff){

            this._audio.currentTime = 0;
            this._audio.play();

        }

    }


    initKeyboard(){

        this.playAudio();

        document.addEventListener('keyup', e=>{

            switch (e.key){

                case "Escape":
    
                    this.clearAll();
    
                break;
    
    
                case "Backspace":
    
                    this.clearEntry();
    
                break;
    
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                   
                    this.addOperator(e.key);
                   break;

                case 'Enter':
                    case '=':
    
                this.calc();
                 break;
    
                case '.':
                case ',':
    
                this.addDot();
                 break;
    
                case '0' :
                case '1' :
                case '2' :
                case '3' :
                case '4' :
                case '5' :
                case '6' :
                case '7' :
                case '8' :
                case '9' :
                    this.addOperator(parseInt(e.key));
                    break;
                
            
                case 'c':

                if (e.ctrlKey) this.copyToClipboard();
                break;
    
    
            }



        });

    }


    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);
        });

    }

    clearAll(){

        this._operation =  []; /* metodo para limpar a array de valores */
        this._lastNumber = ' ';
        this._lastOperator = ' ';
        this.setLastNumberToDisplay(); /*mostra no display*/

    }

    clearEntry(){

        this._operation.pop(); /* metodo para apagar ultimo valor*/

        this.setLastNumberToDisplay(); /*mostra no display*/


    }

    getlastOperation(){

       return this._operation[this._operation.length - 1];

    }

    setLastOperation(value){

        this._operation[this._operation.length - 1] = value; /*
        substitui o ultimo valor e concatena (valor anterior + novo valor)*/
    }

    isOperator(value){ /*metodo para validar se o ultimo valor digitado 
é um operador */

      return  (['+','-','*','%','/'].indexOf(value) > -1);

    }

    pushOperator(value){

        this._operation.push(value);    
        
        if (this._operation.length > 3) { 

            this.calc();

        }

    }

    getResult(){

        return eval(this._operation.join(""));;

    }

    calc(){

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3){

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) {
            last = this._operation.pop();

            
            this._lastNumber = this.getResult();

        }
        
        else if (this._operation.length == 3){

           
            this._lastNumber = this.getLastItem(false);

        }
        
        let result = this.getResult();

        if (last == '%'){

            result /= 100;

            this._operation = [result];

        }else{

            if (last) this._operation.push(last);

       this._operation = [result];

        

        }

       
        
       this.setLastNumberToDisplay();
        
    }

    getLastItem(isOperator = true){

        let lastItem;

        for(let i = this._operation.length-1; i >= 0 ; i--){

            if(this.isOperator(this._operation[i]) == isOperator){

                lastItem = this._operation[i];

                break;

            }
        }

        if(!lastItem){

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

            return lastItem;


    }

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        

        if (!lastNumber) lastNumber = 0; 

        this.displayCalc = lastNumber;

    }

    addOperator(value){ /* metodo para validar se o valor é número ou
    operador. e realizar troca de operadores, (caso o usuario digite dois operadores
    o ultimo é oque será retornado) */


        if (isNaN(this.getlastOperation())){

            if (this.isOperator(value)){ /*adiciona um operador caso seja
            verdadeiro o metodo isOperator */ 

                this.setLastOperation(value); /* trocar o operador */

            } 
            
            else {

                this.pushOperator(value);

                this.setLastNumberToDisplay();

            }

        

         }
         else{ 

            if (this.isOperator(value)){

                this.pushOperator(value);

            } else {

                let newValue =   this.getlastOperation().toString() + value.toString();
          this.setLastOperation(newValue); 
          /* concatena os valores e o 'parseINt' transforma o valor de string para 
          número*/

            this.setLastNumberToDisplay();

            }
      
         }

    }

    setError(){

        this.displayCalc = "Errror";

    }

    addDot(){

        let lastOperation = this.getlastOperation();
        
        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation){
            this.pushOperator('0.');
        } else {

            this.setLastOperation(lastOperation.toString() + '.');

        }

        this.setLastNumberToDisplay();

    }

    exectBtn(value){

        this.playAudio();

        switch (value){

            case "ac":

                this.clearAll();

            break;


            case "ce":

                this.clearEntry();

            break;


            case "soma":

                this.addOperator('+');
               
            break;


            case "subtracao":

            this.addOperator('-');

            break;


            case "divisao":

            this.addOperator('/');

            break;


            case "multiplicacao":

            this.addOperator('*');

            break;


            case "porcento":

            this.addOperator('%');

            break;


            case "igual":

            this.calc();

                
            break;

            case 'ponto':

            this.addDot('.');

            break

            case '0' :
            case '1' :
            case '2' :
            case '3' :
            case '4' :
            case '5' :
            case '6' :
            case '7' :
            case '8' :
            case '9' :
                this.addOperator(parseInt(value));
                break;



            default:
                this.setError;
                break;
        }

    }

    inittButtonsEvents(){

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn,index) => {

            this.addEventListenerAll(btn, 'click drag', e =>{

                let txtBtn = btn.className.baseVal.replace("btn-","");
            
                this.exectBtn(txtBtn);
        });

        this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {

            btn.style.cursor = "pointer";

        })

        });
    }

    setdisplayDateTime(){

            this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
                day: "2-digit",
                month: "long",
                year: "numeric"
            })
            this.displayTime = this.currentDate.toLocaleTimeString(this._locale)

    }
    
    get displayTime(){

        return this._timeEl.innerHTML;
    }

    set displayTime(value){

        return this._timeEl.innerHTML = value;

    }

    get displayDate(){

        return this._dateEl.innerHTML;

    }

    set displayDate(value){

        return this._dateEl.innerHTML = value;
    }

    get displayCalc(){

        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){

        this._displayCalcEl.innerHTML = value;

    }

    get currentDate(){

        return new Date();
    }

    set currentDate(value){

        this._currentDate = value;

    }

} 