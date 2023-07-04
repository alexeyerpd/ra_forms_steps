import * as React from 'react';
import {cn} from 'utils/classname';

import './Steps.scss';

const block = cn('steps');

interface Workout {
    id: number;
    date: string;
    distance: string;
}

export function Steps() {
    const [workouts, setWorkounts] = React.useState<Workout[]>([
        {id: 0, date: '04.04.17', distance: '10'},
        {id: 1, date: '05.04.17', distance: '15'},
    ]);
    const formRef = React.useRef<HTMLFormElement>(null);

    const handleCreate = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries([...fd]);

        if (Object.values(data).filter(Boolean).length < 1) {
            return;
        }

        setWorkounts((pW) => {
            const sameElementIndex = pW.findIndex((el) => el.date && el.date === data.date);
            let newData = {...data, id: pW.length + 1} as Workout;

            if (sameElementIndex !== -1) {
                const elem = pW[sameElementIndex];
                if (!elem) {
                    return [...pW, newData];
                }

                newData = {
                    ...elem,
                    distance: String(Number(elem.distance) + Number(data.distance)),
                } as Workout;

                return [...pW.slice(0, sameElementIndex), newData, ...pW.slice(sameElementIndex + 1)];
            }
            return [...pW, newData];
        });

        formRef.current?.reset();
    };

    const handleUpdate = (w: Workout) => {
        setWorkounts((pW) => {
            const index = pW.findIndex((item) => item.id === w.id);
            if (index !== -1) {
                return [...pW.slice(0, index), w, ...pW.slice(index + 1)];
            }
            return pW;
        });
    };

    return (
        <div className={block()}>
            <form ref={formRef} className={block('form')} onSubmit={handleCreate}>
                <div className={block('form-block')}>
                    <label className={block('form-label')} htmlFor="date">
                        Дата (ДД.ММ.ГГ)
                    </label>
                    <input className={block('form-input')} type="text" name="date" id="date" />
                </div>
                <div className={block('form-block')}>
                    <label className={block('form-label')} htmlFor="distance">
                        Пройдено км
                    </label>
                    <input className={block('form-input')} type="text" name="distance" id="distance" />
                </div>
                <div className={block('form-block')}>
                    <button className={block('form-btn')} type="submit">
                        Ок
                    </button>
                </div>
            </form>
            <div className={block('content')}>
                <div className={block('table', {header: true})}>
                    <div className={block('table-item')}>Дата (ДД.ММ.ГГ)</div>
                    <div className={block('table-item')}>Пройдено км</div>
                    <div className={block('table-item')}>Действия</div>
                </div>
                {workouts.length > 0 && (
                    <div className={block('table', {content: true})}>
                        {workouts.map((item) => {
                            const handleRemove = () => {
                                setWorkounts((prevW) => prevW.filter((w) => w.id !== item.id));
                            };
                            return (
                                <WorkoutItem
                                    key={item.id}
                                    item={item}
                                    onChange={handleUpdate}
                                    onRemove={handleRemove}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

interface WorkoutItemProps {
    item: Workout;
    onRemove: (id: number | string) => void;
    onChange: (item: Workout) => void;
}

function WorkoutItem({item, onRemove, onChange}: WorkoutItemProps) {
    const [edit, setEdit] = React.useState(false);
    const [editedData, setEditedData] = React.useState(item);

    const handleRemove = () => onRemove(item.id);

    const toogleEdit = () => setEdit((prev) => !prev);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setEditedData((prev) => ({...prev, [name]: value}));
    };

    const handleCancel = () => {
        setEditedData(item);
        setEdit(false);
    };

    const handleSave = () => {
        onChange(editedData);
        setEdit(false);
    };

    return (
        <React.Fragment key={item.id}>
            {edit ? (
                <input type="text" name="date" value={editedData.date} onChange={handleChange} />
            ) : (
                <div className={block('table-item')}>{item.date}</div>
            )}
            {edit ? (
                <input type="text" name="distance" value={editedData.distance} onChange={handleChange} />
            ) : (
                <div className={block('table-item')}>{item.distance}</div>
            )}
            <div className={block('table-item')}>
                {edit ? (
                    <React.Fragment>
                        <button type="button" onClick={handleSave}>
                            Save
                        </button>
                        <button type="button" onClick={handleCancel}>
                            Cancel
                        </button>
                    </React.Fragment>
                ) : (
                    <button type="button" onClick={toogleEdit}>
                        Edit
                    </button>
                )}

                <button type="button" onClick={handleRemove}>
                    Remove
                </button>
            </div>
        </React.Fragment>
    );
}
