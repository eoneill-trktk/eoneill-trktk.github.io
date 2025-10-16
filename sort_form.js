document.querySelectorAll('.Form__Element.FormChoice fieldset').forEach(fs => {
  fs.querySelectorAll(':scope > span.choice-item').forEach(span => {
    const input = span.querySelector('input');
    let label = span.nextElementSibling?.matches('label.FormChoice__Label')
      ? span.nextElementSibling
      : (input ? fs.querySelector(`label[for="${input.id}"]`) : null);


    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-block';
    wrapper.style.width = '100%';

    fs.insertBefore(wrapper, span);    
    wrapper.appendChild(span);        
    if (label && label.parentNode === fs) {
      wrapper.appendChild(label);      
    }
  });
});
