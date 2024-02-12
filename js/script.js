//::::: See README.md for version with very detailed comments ::::: 

//**** Create a jQuery function to run when the document loads and the DOM is ready:
$( document ).ready( function () {
  let currentOperand = '0'; //--- Current operand value
  let previousOperand = ''; //--- Previous operand value
  let currentOperation = null; //--- Current operation
  let shouldResetCurrentOperand = false; //--- Flag to reset current operand
  const maxDigits = 15; //--- Max digits allowed in the current operand


  //_____ Update the display with curr & prev operands:
  function updateDisplay () {
    $( '.current-operand' ).html( currentOperand || '0' );
    let previousDisplay = previousOperand;
    if ( currentOperation != null ) {
      previousDisplay += ' ' + currentOperation;
    }
    $( '.previous-operand' ).html( previousDisplay || '&nbsp;' );
  }


  // _____ Append a number to the current operand:
  function appendNumber ( number ) {
    if ( currentOperand === '0' || shouldResetCurrentOperand ) {
      currentOperand = number;
    } else if ( currentOperand.length < maxDigits ) {
      currentOperand += number;
    } else {
      $( '.current-operand' ).html( 'Max digits' );
      setTimeout( updateDisplay, 1000 );
      return;
    }

    //>>> Reset the shouldResetCurrentOperand flag to false:
    shouldResetCurrentOperand = false;
    //>>> Update the display with the new current operand value:
    updateDisplay();
  }


  //_____ Append a decimal point to the current operand:
  function appendDecimal () {
    if ( shouldResetCurrentOperand || currentOperand === '0' || currentOperand === '' ) {
      currentOperand = '0.';
      shouldResetCurrentOperand = false;
      updateDisplay();
    } else if ( !currentOperand.includes( '.' ) && currentOperand.length < maxDigits ) {
      currentOperand += '.';
      updateDisplay();
    }
  }


  //_____ Choose an operation:
  function chooseOperation ( operator ) {
    if (currentOperand === '-' && currentOperation !== null) {
      currentOperand = '';
    }

    if (currentOperand !== '' || currentOperation === null) {
      if (currentOperation !== null && !shouldResetCurrentOperand) {
        compute();
      }
      previousOperand = currentOperand;
      currentOperation = operator;
      currentOperand = '';
      shouldResetCurrentOperand = true;
    } else if (currentOperation !== null && currentOperand === '' && operator !== '-') {
      currentOperation = operator;
    } else if (operator === '-') {
      currentOperand = '-';
      shouldResetCurrentOperand = false;
    }

    updateDisplay();
  }


  //_____ Perform the computation:
  function compute () {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (currentOperation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case 'x':
        computation = prev * current;
        break;
      case '/':
        if (current === 0) {
          alert("Cannot divide by zero");
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    previousOperand += ' ' + currentOperation + ' ' + currentOperand;
    const computationString = computation.toString();

    if (computationString.length > 15) {
      currentOperand = computationString.substring(0, 14) + '...';
    } else {
      currentOperand = computationString;
    }

    currentOperation = null;
    shouldResetCurrentOperand = true;
    updateDisplay();
  }


  //_____ Clear the calculator:
  function clear () {
    currentOperand = '0';
    previousOperand = '';
    currentOperation = null;
    shouldResetCurrentOperand = false;
    updateDisplay();
  }


  //_____ Event listener for number buttons:
  $( ".number" ).on( 'click', function () {
    const numberMap = {
      zero: '0',
      one: '1',
      two: '2',
      three: '3',
      four: '4',
      five: '5',
      six: '6',
      seven: '7',
      eight: '8',
      nine: '9'
    };

    const number = numberMap[ this.id ];
    appendNumber( number );
  } );


  //_____ Event listener for operator buttons:
  $( ".operator" ).on( 'click', function () {
    const operatorMap = {
      add: '+',
      subtract: '-',
      multiply: 'x',
      divide: '/'
    };

    const operator = operatorMap[ this.id ];
    chooseOperation( operator );
  } );


  //_____ Event listener for equals button:
  $( "#equals" ).on( 'click', function () {
    if ( currentOperation !== null ) {
      compute();
    }
  } );


  //_____ Event listener for clear button:
  $( "#clear" ).on( 'click', function () {
    clear();
  } );


  //_____ Event listener for decimal button:
  $( "#decimal" ).on( 'click', function () {
    appendDecimal();
  } );


  //_____ Initialize the display:
  updateDisplay();
} );