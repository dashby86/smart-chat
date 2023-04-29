const HelloWorld = () => {
    return (
        <div>
            Hello World!
        </div>
    );
};

const chatWidgetHost = document.querySelector('[data-widget-host="chat-widget"]');
ReactDOM.render(<HelloWorld />, chatWidgetHost);
