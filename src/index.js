import ReactDOM from "react-dom";
import "./index.less";
import React, { useEffect, useState } from "react";
import words from "./words.js";
import { produce } from "immer";

let localData = { index: 0, learned: [] };

const App = () => {
    const [data, setData] = useState(localData);

    const { index } = data || {};

    window.electronAPI.saveData(JSON.stringify(data));

    useEffect(() => {
        window.electronAPI.onKeyEvent((key) => {
            if (key === "Ctrl+Shift+Left") {
                setData((data) => {
                    return produce(data, (data) => {
                        data.index = (data.index - 1) % words.length;
                        if (data.index < 0) {
                            data.index = 0;
                        }
                    });
                });
            } else if (key === "Ctrl+Shift+Right") {
                setData((data) => {
                    return produce(data, (data) => {
                        data.index = (data.index + 1) % words.length;
                    });
                });
            } else if (key === "Ctrl+Shift+Up") {
                setData((data) => {
                    return produce(data, (data) => {
                        data.learned = [
                            ...new Set([...data.learned, data.index])
                        ];
                    });
                });
            }
        });
    }, []);

    return (
        <div
            className={
                "container " +
                (data.learned.indexOf(index) >= 0 ? "green" : "white")
            }
        >
            <p className="e">
                <span>{index}</span> {words[index].e}
            </p>
            <p className="c">{words[index].c}</p>
        </div>
    );
};

window.electronAPI.loadData().then((_data) => {
    localData = _data || localData;
    ReactDOM.render(<App />, document.getElementById("root"));
});
