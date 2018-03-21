import React, {Component} from 'react';
import Archive from './Archive'
// import axios from 'axios';
import './App.css';

export default class App extends Component {
    state = {
        origins: {},
        currentOrigin: ""
    };

    componentDidMount = () => {
        // Здесь подразумевается запрос на получение данных сервера
        // axios.get(`https://api.server/get-video-origins`)
        //     .then(res => {
        //         const origins = res.data;
        //         this.setState({origins});
        //     })

        // А пока выставляем статические данные
        this.setState({origins: ["cats", "dogs", "snakes"]});
    };

    handleClick = origin => this.setState({
        currentOrigin: origin
    });

    render() {
        return (
            <div>
                <ul className={"origins_list"}>
                    {Object.keys(this.state.origins).map(
                        origin =>
                            <li key={origin}
                                className={(this.state.origins[origin] === this.state.currentOrigin) ? "current" : ""}
                                onClick={this.handleClick.bind(this, this.state.origins[origin])}>
                                {`Camera archive for ${this.state.origins[origin]}`}
                            </li>
                    )}
                </ul>
                <div className={"archive"}>
                    <Archive origin={this.state.currentOrigin}/>
                </div>
            </div>
        )
    }
}