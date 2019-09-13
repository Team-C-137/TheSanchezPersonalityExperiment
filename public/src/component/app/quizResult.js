import Component from '../Component.js';

// this won't work here...
const props = this.props;

// hmm, I don't think this file is used at all. if so, delete!

class QuizResult extends Component {
    renderHTML(){

        return /*html*/ `
        <div id="main-img-container" class="main-img">
        <img class="main-img" src="${props.image}" height="500";>
    <div>

    <div class="list-container">
        <div class="title">
            <p class="first">YOU ARE</p> 
            <p><span class="character">${props.name.toUpperCase()}</span></p>
            <p class="quote">${props.quote}</p>
        </div>

        <div class="personality">
            <h2>${props.personality}</h2>
                <p><span class="description">${props.description}</span></p>
        </div>

        <ul class="details">
            <li>${props.status}</li>
            <li>${props.species}</li>
            <li>${props.gender}</li>
            <li>${props.origin}</li>
        </ul>
    </div>
        `;
    }
}

export default QuizResult;