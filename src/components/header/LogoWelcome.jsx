import lyLight from '../../assets/lyweek-light.jpg'
function LogoWelcome({ userName }) {
    return (
        <section className="logo-and-welcome">
            <a href="#">
                <img className="logo" src={lyLight} alt="LyWeek logo" />
            </a>
            <h2 className="welcome">Welcome back, {userName}</h2>
        </section>
        
    );
}
export default LogoWelcome;