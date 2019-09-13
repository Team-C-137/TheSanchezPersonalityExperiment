import Component from '../Component.js';

class AboutCard extends Component {
    renderHTML() {
        const props = this.props;

        return /*html*/`
            <div class="about-card">
                <h3>${props.name}</h3>
                <div id="img-wrapper">
                    <img src="${props.image}">
                </div>
                <p id="about-description">${props.desc}</p>
            </div> 
        `;
    }
}

export default AboutCard;