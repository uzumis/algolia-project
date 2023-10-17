const components = import('../../../../import-components.js');
const content = document.getElementById("dynamic-content-register");
if(content !== null && document.location.pathname.length === 1 && document.location.pathname === '/'){
    components
    .then(val => {
        return val.register;
    })
    .then(register => {
        return register.map(item => {
            let el = document.createElement("a");
            el.href = `${item}.html`;
            el.text = `${item}`;
            let wrapper = document.createElement("h1");
            wrapper.appendChild(el);
            content.appendChild(wrapper);
        });
    });
}
