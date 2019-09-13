import Component from '../Component.js';

class QuizApp extends Component {

    onRender(dom) {
        const selectAnswer = this.props.selectAnswer;
        const inputs = dom.querySelectorAll('input');
        // not necessary. DOMList has a forEach method
        inputs.forEach(input => {
            input.addEventListener('click', () => {
                selectAnswer(input.value);
            });
        });
    }

    renderHTML() {
        const props = this.props;

        return /*html*/`
        <div>
            <header id="question-header">
                        <p>${props.questionHeader}</p>
                    </header>
                    <div class="quiz-img-container"><img class="quiz-image" src="${props.image}" alt="portal"></div>
                    <div id="question">
                        <span>${props.questionText}</span>
                    </div>
                    <div id="answer-box">
                        <label class="answer"><input class="answer-input" type="radio" name="question-one"
                            value="${props.answerOneMBTI}">${props.answerOne}</label>
                        <label class="answer"><input class="answer-input" type="radio" name="question-one"
                            value="${props.answerTwoMBTI}">${props.answerTwo}</label>
                        <label class="answer"><input class="answer-input" type="radio" name="question-one"
                            value="${props.answerThreeMBTI}">${props.answerThree}</label>
                        <label class="answer"><input class="answer-input" type="radio" name="question-one"
                            value="${props.answerFourMBTI}">${props.answerFour}</label>
                    </div>
                    </div>
        `;
    }
}

export default QuizApp;