function WeekButton({weekNumber, position}) {
//logic is that based on position arg (left or right), it will render that explicit button
    return (
    <div className="week-nav">
        {position === 'left' && (
            <button className="prev-week">
                <i className="fa-solid fa-circle-left"></i>
                <span>Previous week</span>
            </button>
        )}
        {position === 'right' && (
            <button className="next-week">
                <span>Next week</span>
                <i className="fa-solid fa-circle-right"></i>
            </button>
        )}
    </div>
    );
}
export default WeekButton;