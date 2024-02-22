import logo from "./logo.png";
const Navbar = () => {
  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container">
        <a className="navbar-brand" href="https://10academy.org/">
          <img src={logo} alt="10x logo" width="40" height="40" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
