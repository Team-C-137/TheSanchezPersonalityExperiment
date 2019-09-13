import Component from '../Component.js';
import Header from './Header.js';
import Type from './Type.js';
import { getAllCharacters, getCharacterFromApi, getMBTI } from '../../services/quiz-api.js';

class StatsApp extends Component {

    onRender(dom) {
        const header = new Header();
        dom.prepend(header.renderDOM());

        getAllCharacters().then(result => {

            result.forEach(char => {

                let typeProps = {};

                getCharacterFromApi(char.name)
                    .then(result => {
                        const info = result.results[0];
                        typeProps.image = info.image;
                        typeProps.status = info.status;
                        typeProps.species = info.species;
                        typeProps.gender = info.gender;
                        typeProps.origin = info.origin.name;
                        typeProps.name = char.name;
                        typeProps.quote = char.quote;
                        typeProps.personality = char.mbti;

                        getMBTI(char.mbti)
                            .then(result => {
                                typeProps.description = result[0].description;
                            })
                            .then(() => {
                                const type = new Type(typeProps);
                                dom.querySelector('#types').appendChild(type.renderDOM());
                            });
                    });
            });
        });
    }

    renderHTML() {
        return /*html*/`
            <div id="root">
                <section id="all-time-stats">
                    <h2>ALL TIME STATS</h2>
                    <div id="bar-graph">
                        <canvas id="all-user-stats" width="100" height="40">
                        </canvas>
                        <!-- insert bar graph -->
                    </div>
                </section>

                <div id ="types-wrapper">
                <h2>PERSONALITY TYPES</h2>
                <div id="types">

                </div>
            </div>
        `;
    }
}

export default StatsApp;