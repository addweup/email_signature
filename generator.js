
(function() {
  const fieldNameMapping = {
    primaryName: 'primary-name',
    secondaryName: 'secondary-name',
    postion: 'job-position',
    email: 'email-address',
    mobile: 'mobile-number',
  }

  const renderMethod = {
    [fieldNameMapping.primaryName]: (name) => String(name).trim(),
    [fieldNameMapping.secondaryName]: (name) => String(name).trim(),
    [fieldNameMapping.postion]: (postion) => String(postion).trim(),
    [fieldNameMapping.email]: (address) => String(address).trim(),
    [fieldNameMapping.mobile]: (number) => number && number.length > 0 ? `+${String(number).trim().match(/\d{1,3}/g).join(' ')}` : '',
  };

  const fieldCollection = new Map();

  const $form = document.querySelector('#form');
  const $present = document.querySelector('#present');
  const $status = document.querySelector('#status');

  function render($input) {
    const field = $input.getAttributeNode('name').value;

    let $target;
    if (fieldCollection.has(field)) {
      $target = fieldCollection.get(field);
    } else {
      $target = document.querySelector(`#${field}`);
      fieldCollection.set(field, $target);
    }

    const value = renderMethod[field]($input.value);

    $target.innerText = value;

    if (fieldNameMapping.email === field) {
      $target.setAttribute('href', `mailto:${value}`)
    }
  }

  let copyTimer;
  function showCopyResult(success) {
    if (copyTimer) {
      window.clearTimeout(copyTimer);
    }

    const text = success ? 'Copied' : 'Failed';
    $status.innerText = text;

    if (!success) {
      $status.classList.add('failed');
    } else {
      $status.classList.remove('failed');
    }

    $status.classList.add('show');

    const waitTime = 3000;
    copyTimer = window.setTimeout(() => {
      $status.classList.remove('show');
      window.clearTimeout(copyTimer);
    }, waitTime);
  }

  function copyToClipboard(isHtml = false) {
    return () => {
      window.getSelection().empty();

      if (isHtml) {
        const htmlText = $present.innerHTML;
        const $hiddenInput = document.createElement('textarea');
        $hiddenInput.setAttribute('style', 'opacity: 0; width: 0; height: 0;');
        $hiddenInput.setAttribute('id', 'selectedInput');
        $hiddenInput.value = htmlText;
        document.body.appendChild($hiddenInput);
        $hiddenInput.select();
      } else {
        const selectedRange = document.createRange();
        selectedRange.selectNodeContents($present.querySelector('table'));
        window.getSelection().addRange(selectedRange);
      }

      try {
        const result = document.execCommand('copy');
        showCopyResult(result);
      } catch(error) {
        console.error('[Copy]', error);
      } finally {
        window.getSelection().empty();

        if(isHtml) {
          const $hiddenInput = document.querySelector('#selectedInput');
          if ($hiddenInput) {
            document.body.removeChild($hiddenInput);
          }
        }
      }
    };
  }

  // Init
  Object.values(fieldNameMapping).forEach((field) => render(document.querySelector(`#input-${field}`)));
  $form.addEventListener('keyup', (evt) => console.log(evt) || render(evt.target));
  $form.addEventListener('change', (evt) => console.log(evt) || render(evt.target));

  document.querySelector('#copy-html-button').addEventListener('click', copyToClipboard(true));
  document.querySelector('#copy-text-button').addEventListener('click', copyToClipboard(false));
})();
