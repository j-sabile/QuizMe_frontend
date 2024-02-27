function Popup(props) {
  if (!props.show) {
    return null;
  }

  return (
    <div id="popup">
      <div className="popup-content d-flex flex-column">{props.children}</div>
    </div>
  );
}

export default Popup;
