(function() {
  const { forEach, reduce } = Array.prototype;
  const forms = document.getElementsByClassName('formidable-form');

  forEach.call(forms, form => {
    const { url, script } = form.dataset;

    if (url) {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.send();

      xhr.onload = () => {
        if (xhr.status === 200) renderForm(form, xhr.response);
      };
    } else {
      const xml = document.getElementById(script).textContent;

      renderForm(form, xml);
    }
  });

  function renderForm(node, xml) {
    const form = parseXML(xml);

    const {
      submit,
      stepMode,
      nextLabel,
      submitLabel,
      submitFormat,
      cssFramework,
      previousLabel
    } = node.dataset;

    const enctype = submitFormat
      ? `application/${submitFormat}`
      : 'application/x-www-form-urlencoded';

    const id = form.getAttribute('id');
    const title = form.getAttribute('title');
    const steps = form.getElementsByTagName('step');

    const pages = reduce.call(steps, (pages, step, idx) => {
      const firstPage = idx === 0;
      const lastPage = idx === steps.length - 1;

      const id = step.getAttribute('id');
      const title = step.getAttribute('title');
      const questions = step.getElementsByTagName('question');

      const inputs = reduce.call(questions, (inputs, question) =>
        inputs += buildInput(question, { cssFramework, firstPage }), '');

      const fieldset =
        `<legend class="formidable-legend">${title}</legend>${inputs}`;

      if (stepMode === 'pages') {
        if (firstPage) pages += `
          <fieldset
            id=${id}
            data-page="1"
            class="formidable-fieldset">
            ${fieldset}
          </fieldset>`;
        else pages += `
          <fieldset
            id=${id}
            data-page="${idx + 1}"
            class="formidable-fieldset"
            hidden>
            ${fieldset}
          </fieldset>`;

        if (lastPage) pages += `
          <button
            class="formidable-previous-button"
            hidden>${previousLabel || 'Previous'}
          </button>
          <button
            class="formidable-next-button">${nextLabel || 'Next'}
          </button>
          <input
            type="submit"
            value="${submitLabel || 'Submit'}"
            class="formidable-submit-button
              ${addClasses('btn btn-primary', cssFramework)}"
            hidden>`;
      }
      else {
        pages += `
          <fieldset id=${id} class="formidable-fieldset">
            ${fieldset}
          </fieldset>`;

        if (lastPage) pages += `
          <input
            type="submit"
            value="${submitLabel || 'Submit'}"
            class="formidable-submit-button
              ${addClasses('btn btn-primary', cssFramework)}">`;
      }

      return pages;
    }, '');

    node.outerHTML = `
      <form class="formidable-form"
        id="${id}"
        method="POST"
        action="${submit}"
        enctype="${enctype}">
        <div class="formidable-title">${title}</div>
        ${pages}
      </form>`;

    addEventHandlers(id, { submit, stepMode, enctype });
  }

  function addEventHandlers(id, parameters) {
    const { submit, stepMode, enctype } = parameters;

    const form = document.querySelector(`form#${id}`);
    const inputs = form.getElementsByClassName('formidable-input');

    form.addEventListener('submit', submitForm);

    forEach.call(inputs, input => {
      const value = localStorage.getItem(`${id}#${input.id}`);

      if (input.options) {
        input.value = null;

        forEach.call(input.options, option => {
          if (option.value === value) input.selectedIndex = option.index;

          input.addEventListener('change', save);
        });
      } else {
        input.value = value;
        input.addEventListener('keyup', save);
      }

      input.addEventListener('focus', function() {
        this.style.borderColor = null;
      });
    });

    if (stepMode === 'pages') displayPageButtons(form);

    function submitForm(e) {
      e.preventDefault();

      const xhr = new XMLHttpRequest();
      xhr.open('POST', submit);

      const isValidated = validate(inputs);
      if (!isValidated) return;

      xhr.send(prepareBody(inputs, enctype));

      xhr.onload = () => {
        if (xhr.status === 200) localStorage.clear();
      };
    }

    function save() {
      localStorage.setItem(`${id}#${this.id}`, this.value);
    }
  }

  function buildInput(question, parameters) {
    const { cssFramework, firstPage } = parameters;

    const { id } = question;
    const type = question.getAttribute('type');
    const title = question.getAttribute('title');
    const maxlength = question.getAttribute('maxlength');
    const isRequired = question.getAttribute('required');
    const placeholder = question.getAttribute('placeholder');

    const input = type === 'dropdown' ? `
      <label class="formidable-label" for="${id}">${title}</label>
      <select
        id="${id}"
        class="formidable-input ${addClasses('form-control', cssFramework)}"
        data-required="${isRequired}">
        ${buildOptions(question)}
      </select>` : `

      <label class="formidable-label" for="${id}">${title}</label>
      <input
        class="formidable-input ${addClasses('form-control', cssFramework)}"
        id="${id}"
        size="${maxlength}"
        maxlength="${maxlength}"
        type="${HTMLType(type)}"
        placeholder="${placeholder}"
        data-required="${isRequired}">`;

    return cssFramework === 'bootstrap4' && firstPage ?
      `<div class="form-group">${input}</div>` : input;
  }

  function buildOptions(question) {
    const options = question.getElementsByTagName('option');

    return reduce.call(options, (options, option) => {
      options += `
        <option value="${option.getAttribute('value')}">
          ${option.getAttribute('label')}
        </option>`;

      return options;
    }, '');
  }

  function prepareBody(inputs, enctype) {
    switch (enctype) {
      case 'application/json':
        const body = reduce.call(inputs, (body, input) => {
          body[input.id] = input.value;

          return body;
        }, {});

        return JSON.stringify(body);
      case 'application/x-www-form-urlencoded':
        return reduce.call(inputs, (string, input) =>
          string += encodeURIComponent(input.id) +
            `=${encodeURIComponent(input.value)}&`, '');
    }
  }

  function displayPageButtons(form) {
    let currentStep = 1;

    const lastPage =
      +form.querySelector('fieldset:last-of-type').dataset.page;

    const nextButton = form.querySelector('.formidable-next-button');
    const previousButton = form.querySelector('.formidable-previous-button');
    const submitButton = form.querySelector('.formidable-submit-button');

    displayLastPageButtons();

    nextButton.addEventListener('click', nextStep);
    previousButton.addEventListener('click', previousStep);

    function nextStep(e) {
      e.preventDefault();

      const currentPage =
        form.querySelector(`fieldset[data-page="${currentStep}"]`);
      const nextPage =
        form.querySelector(`fieldset[data-page="${currentStep + 1}"]`);

      const inputs = currentPage.getElementsByClassName('formidable-input');

      const isValidated = validate(inputs);
      if (!isValidated) return;

      nextPage.hidden = false;
      currentPage.hidden = true;
      previousButton.hidden = false;

      currentStep += 1;

      displayLastPageButtons();
    }

    function previousStep(e) {
      e.preventDefault();

      const currentPage =
        form.querySelector(`fieldset[data-page="${currentStep}"]`);
      const previousPage =
        form.querySelector(`fieldset[data-page="${currentStep - 1}"]`);

      nextButton.hidden = false;
      submitButton.hidden = true;
      currentPage.hidden = true;
      previousPage.hidden = false;

      currentStep -= 1;

      if (currentStep === 1) previousButton.hidden = true;
    }

    function displayLastPageButtons() {
      if (currentStep === lastPage) {
        nextButton.hidden = true;
        submitButton.hidden = false;
      }
    }
  }

  function parseXML(xml) {
    return new DOMParser()
      .parseFromString(xml, 'application/xml')
      .querySelector('form');
  }

  function validate(inputs) {
    return reduce.call(inputs, (isValidated, input) => {
      if (input.dataset.required === 'true' && !input.value.trim()) {
        input.style.borderColor = '#FF0000';
        isValidated = false;
      }
      return isValidated;
    }, true);
  }

  function HTMLType(type) {
    switch (type) {
      case 'money':
      case 'integer': return 'number';
      default: return type;
    }
  }

  function addClasses(classes, cssFramework) {
    return cssFramework === 'bootstrap4' ? classes: '';
  }
}());
