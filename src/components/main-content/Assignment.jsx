function Assignment({name, priority, dueDate}) {

    return (
        <>
            <div className="assignment">
                <input type="checkbox" />
                <span>{name}</span>
                {priority && <span>★ </span>}
                <span className="assignment-due-date">{dueDate}</span>
            </div>
        </>
    );
}
export default Assignment;