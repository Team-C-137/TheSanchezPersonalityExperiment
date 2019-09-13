import Component from '../Component.js';

class Type extends Component {

    onRender(dom) {
        const div = dom.querySelector('.type');
        const desc = dom.querySelector('#desc');

        div.addEventListener('mouseover', () => {
            desc.classList.remove('hidden');
        });

        div.addEventListener('mouseout', () => {
            desc.classList.add('hidden');
        });
    }
    renderHTML() {
        const props = this.props;
        return /*html*/`
            <div id = "top-div">
                <div class="type">
                    <span>${props.name}</span>
                    <img
                        src="${props.image}"
                        title="${props.quote}">
                    <span>${props.personality}</span>
                    <span id="desc" class="hidden">${props.description}</span>
                    <ul>
                        <li>Status: ${props.status}</li>
                        <li>Species: ${props.species}</li>
                        <li>Gender: ${props.gender}</li>
                        <li>Origin: ${props.origin}</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

export default Type;