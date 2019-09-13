import Component from '../Component.js';
import store from '../../services/store.js';
class Header extends Component {

    onRender(dom) {
        const logoutButton = dom.querySelector('#log-out');

        logoutButton.addEventListener('click', () => {
            store.removeToken();
            window.location = 'auth.html';
        });
    }
    renderHTML() {
        return /*html*/`
            <header id="main-header">
                 <div id="logo">
                    <a href="./">
                        <h1 class="title">
                            The Sanchez Personality Experiment
                        </h1>
                    </a>
                </div>
                <a href="./profile.html"><span>[profile]</span></a>
                <a href="./about.html"><span>[about us]</span></a>
                <a href="./stats.html"><span>[stats]</span></a>
                <div id="log-out-container">
                    <button id="log-out">[log out]</button>
                </div>
            </header>
        `;
    }
}

export default Header;