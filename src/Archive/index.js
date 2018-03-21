import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './style.css';


export default class Archive extends Component {
    state = {
        page: 0,
        frameWidth: 400
    };

    componentWillUpdate = (nextProps, nextState) => {
        if (nextProps.origin !== this.props.origin) {
            this._scroller.style.right = "0px";
            this.setState({
                page: 0
            })
        }
    };

    /**
     * Добавление ссылки на html-элемент
     * для оперирования при прокручивании или перетаскивании
     * @param scroller
     */
    addScroller = (scroller) => {
        this._scroller = ReactDOM.findDOMNode(scroller);
        this._scroller.style.right = "0px";
    };

    onMouseEnter = () => {
        window.addEventListener('mousewheel', this.onWheel);
        this._scrolling = {
            right: parseInt(this._scroller.style.right, 10)
        };
    };

    onWheel = (e) => {
        this.scrollFrames(e.deltaY);
        this.addPageIfNeed();
    };

    onMouseLeave = () => {
        window.removeEventListener('mousewheel', this.onWheel);
    };

    onMouseDown = (e) => {
        event.preventDefault();

        this._scrolling = {
            clientX: e.clientX,
            right: parseInt(this._scroller.style.right, 10)
        };

        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);

    };

    onMouseMove = (e) => {
        e.preventDefault();
        const {clientX} = this._scrolling;

        this.scrollFrames(e.clientX - clientX);
    };

    onMouseUp = () => {
        this.addPageIfNeed();

        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
    };

    /**
     * Изменение отступа справа при прокручивании или перетаскивании
     * @param delta - изменение координаты
     */
    scrollFrames = (delta) => {
        let newPos = (this._scrolling.right - delta > 0) ? 0 : this._scrolling.right - delta;
        this._scroller.style.right = newPos + "px";
    };

    /**
     * Проверка условия для добавления кадров на страницу
     */
    addPageIfNeed = () => {
        let {page, frameWidth} = this.state;

        this._scrolling = {
            clientX: 0,
            right: parseInt(this._scroller.style.right, 10)
        };

        if (this._scrolling.right <= -(5 + 5 * page) * frameWidth) {
            this.setState({
                page: ++page
            })
        }
    };

    render() {
        const {page} = this.state;
        const date = new Date(Math.round(Date.now() / 60000) * 60000);

        let images = [];

        if (this.props.origin) {
            for (let i = 10 + 5 * page; 0 < i; i--) {
                const frameDate = new Date(date - (60000 * i));
                const dateString = frameDate.toTimeString().substr(0, 5);
                const dateISOString = frameDate.toISOString().replace(/[:\-Z]/g, '');
                const minute = (frameDate.getMinutes()+"").substr(-1, 1);

                images.push({
                    frameKey: `${this.props.origin}/${dateISOString}`,
                    dateString: dateString,
                    // Здесь подразумевается путь к картинке на сервере
                    imgUrl: `/${this.props.origin}/${minute}.jpg`
                });
            }
        }

        return (
            <div className={"frames"}
                 ref={this.addScroller}
                 onMouseDown={this.onMouseDown}
                 onMouseEnter={this.onMouseEnter}
                 onMouseLeave={this.onMouseLeave}
            >
                {images.map(function (value) {
                    return (
                        <div key={value.frameKey}
                             className={"frame not_loaded"}
                        >
                            <div className={"frame_time"}>{value.dateString}</div>
                            <div className={"frame_image"}
                                 style={{backgroundImage: `url(${value.imgUrl})`}}
                            >
                                <img src={`${value.imgUrl}`}
                                     alt={''}
                                     onLoad={(e) => {
                                         e.target.parentNode.parentNode.classList.remove("not_loaded");
                                     }
                                     }
                                />

                            </div>
                            <div className={"frame_bottom"}/>
                        </div>
                    )
                })}
            </div>
        )
    }
}
