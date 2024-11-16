import { useState } from "react";

function FilterModal({ closeFilterModal, setMyFavorites }) {
    const favorites = JSON.parse(localStorage.getItem('favorites'));
    const [timeOption, setTimeOption] = useState('');
    const [typeState, setTypeState] = useState({
        alltype: true,
        apple: false,
        gameConsole: false,
        controller: false,
        others: false
    });

    const timeRange = {

        one_month:
        {
            start: 0,
            end: 86400 * 30
        }

        ,
        three_month:
        {
            start: 86400 * 30,
            end: 86400 * 30 * 3
        }
        ,
        half_year:
        {
            start: 86400 * 30 * 3,
            end: 86400 * 30 * 6
        }
        ,
        one_year:
        {
            start: 86400 * 30 * 6,
            end: 86400 * 30 * 12
        }
        ,
    };
    const handleTime = (e) => {
        const { id } = e.target;
        setTimeOption(id);
    };
    let filterTimeArr;
    const filerTime = (filterArr) => {
        const currentTime = Math.floor(Date.now() / 1000); // 当前时间的 Unix 时间戳
        if (timeOption === 'alltime') {
            filterTimeArr = filterArr;
        } else {
            let timeRangeOption;
            switch (timeOption) {
                case 'one_month':
                    timeRangeOption = timeRange.one_month;
                    break;
                case 'three_month':
                    timeRangeOption = timeRange.three_month;

                    break;
                case 'half_year':
                    timeRangeOption = timeRange.half_year;

                    break;
                case 'one_year':
                    timeRangeOption = timeRange.one_year;

                    break;
                case 'over_one_year':
                    filterTimeArr = filterArr.filter((item) => (currentTime - item.create_at) > timeRange.one_year.end);
                    setMyFavorites(filterTimeArr);
                    return;

                default:
                    filterTimeArr = filterArr;
                    setMyFavorites(filterTimeArr);
                    return;
            }
            filterTimeArr = filterArr.filter((item) => {
                const timeDifference = currentTime - item.create_at;
                return timeDifference > timeRangeOption.start && timeDifference < timeRangeOption.end;
            });
        }
        setMyFavorites(filterTimeArr);
    };






    const handleType = (e) => {
        const { id, checked } = e.target;
        if (id === 'alltype' && checked) {
            setTypeState({
                alltype: true,
                apple: false,
                gameConsole: false,
                controller: false,
                others: false
            });
        } else {
            setTypeState({
                ...typeState,
                alltype: false,
                [id]: checked
            });
        }
    };
    let filterArr;
    const filterFavorite = () => {
        if (typeState.alltype) {
            filterArr = favorites;
            setMyFavorites(favorites);
        } else {
            filterArr = favorites.filter(favorite => typeState[favorite.category]);
            setMyFavorites(filterArr);
        }
        filerTime(filterArr);
        closeFilterModal();
    };
    const reset = () => {
        setTypeState({
            alltype: true,
            apple: false,
            gameConsole: false,
            controller: false,
            others: false
        });
        setTimeOption('');
    };





    return (
        <div id="filterModal" className="modal" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">篩選條件</h5>
                        <button type="button" className="btn-close"
                            aria-label="Close"
                            onClick={closeFilterModal}
                        />
                    </div>
                    <div className="modal-body">

                        <div className="border-bottom">
                            <h5>商品類型</h5>
                            <ul
                                style={{
                                    display: 'table',
                                    margin: '0px',
                                    padding: '0px'
                                }}>
                                <li className="option">
                                    <input type="checkbox" id='alltype'
                                        checked={typeState.alltype}
                                        onChange={(e) => handleType(e)}
                                    />
                                    <label htmlFor="alltype">全部</label>
                                </li>
                                <li className="option">
                                    <input type="checkbox" id='apple'
                                        checked={typeState.apple}
                                        onChange={(e) => handleType(e)} />
                                    <label htmlFor="apple">蘋果</label>
                                </li>
                                <li className="option">
                                    <input type="checkbox" id='gameConsole'
                                        checked={typeState.gameConsole}
                                        onChange={(e) => handleType(e)} />
                                    <label htmlFor="gameConsole">遊戲主機</label>
                                </li>
                                <li className="option">
                                    <input type="checkbox" id='controller'
                                        checked={typeState.controller}
                                        onChange={(e) => handleType(e)} />
                                    <label htmlFor="controller">遊戲手把</label>
                                </li>
                                <li className="option">
                                    <input type="checkbox" id='others'
                                        checked={typeState.others}
                                        onChange={(e) => handleType(e)} />
                                    <label htmlFor="others">其他</label>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <div className="mt-3">
                                <h5>放入下次再買時間</h5>
                            </div>
                            <ul
                                style={{
                                    display: 'table',
                                    margin: '0px',
                                    padding: '0px'
                                }}>
                                <li className="option">
                                    <input type="radio" name='time' id='alltime'
                                        onChange={(e) => handleTime(e)}
                                        checked={timeOption === 'alltime' || timeOption === ''}
                                    />
                                    <label htmlFor="alltime">全部</label>
                                </li>
                                <li className="option">
                                    <input type="radio" name='time' id='one_month'
                                        onChange={(e) => handleTime(e)}
                                    />
                                    <label htmlFor="one_month">一個月內</label>
                                </li>
                                <li className="option">
                                    <input type="radio" name='time' id='three_month'
                                        onChange={(e) => handleTime(e)}
                                    />
                                    <label htmlFor="three_month">三個月內</label>
                                </li>
                                <li className="option">
                                    <input type="radio" name='time' id='half_year'
                                        onChange={(e) => handleTime(e)}
                                    />
                                    <label htmlFor="half_year">六個月內</label>
                                </li>
                                <li className="option">
                                    <input type="radio" name='time' id='one_year'
                                        onChange={(e) => handleTime(e)}
                                    />
                                    <label htmlFor="one_year">一年內</label>
                                </li>
                                <li className="option">
                                    <input type="radio" name='time' id='over_one_year'
                                        onChange={(e) => handleTime(e)}
                                    />
                                    <label htmlFor="over_one_year">超過一年</label>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary"
                            onClick={reset}
                        >重新設定</button>
                        <button type="button" className="btn btn-primary"
                            onClick={filterFavorite}
                        >確認</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FilterModal;