(function () {
  function cloneValue(value) {
    return JSON.parse(JSON.stringify(value || {}));
  }

  function parseCaseData() {
    const el = document.getElementById('adventures-casebook-data');
    if (!el) {
      return null;
    }

    try {
      return JSON.parse(el.textContent);
    } catch (error) {
      console.error('Unable to parse adventures casebook data.', error);
      return null;
    }
  }

  function assignState(target, source) {
    Object.keys(target).forEach(function (key) {
      delete target[key];
    });

    Object.keys(source || {}).forEach(function (key) {
      target[key] = cloneValue(source[key]);
    });
  }

  function mergeState(target, patch) {
    Object.keys(patch || {}).forEach(function (key) {
      target[key] = cloneValue(patch[key]);
    });
  }

  function normalizeArray(value) {
    if (Array.isArray(value)) {
      return value;
    }

    if (value === null || value === undefined || value === '') {
      return [];
    }

    return [String(value)];
  }

  function createParagraphs(container, items) {
    normalizeArray(items).forEach(function (item) {
      const p = document.createElement('p');
      p.textContent = String(item);
      container.appendChild(p);
    });
  }

  function renderBullets(listEl, items) {
    listEl.innerHTML = '';
    const normalizedItems = normalizeArray(items);

    if (!normalizedItems.length) {
      listEl.classList.add('isHidden');
      return;
    }

    listEl.classList.remove('isHidden');
    normalizedItems.forEach(function (item) {
      const li = document.createElement('li');
      li.textContent = String(item);
      listEl.appendChild(li);
    });
  }

  function renderReflection(parent, reflection) {
    if (!reflection) {
      return;
    }

    const box = document.createElement('section');
    box.className = 'reflectionBox';

    const title = document.createElement('h2');
    title.textContent = reflection.title || 'Clinical reflection';
    box.appendChild(title);

    createParagraphs(box, reflection.body);

    const bullets = normalizeArray(reflection.bullets);
    if (bullets.length) {
      const list = document.createElement('ul');
      bullets.forEach(function (item) {
        const li = document.createElement('li');
        li.textContent = String(item);
        list.appendChild(li);
      });
      box.appendChild(list);
    }

    parent.appendChild(box);
  }

  const data = parseCaseData();

  if (!data) {
    return;
  }

  const initialState = cloneValue(data.initialState || {});
  const state = cloneValue(initialState);
  const historyStack = [];
  let currentEntry = {
    kind: 'scene',
    id: data.startScene || 'start'
  };

  const els = {
    banner: document.querySelector('.caseBanner'),
    title: document.getElementById('sceneTitle'),
    body: document.getElementById('sceneBody'),
    bullets: document.getElementById('sceneBullets'),
    options: document.getElementById('sceneOptions'),
    backButton: document.getElementById('backButton'),
    frame: document.querySelector('.caseFrame')
  };

  function getScene(id) {
    if (!data.scenes || !data.scenes[id]) {
      throw new Error('Missing scene: ' + id);
    }
    return data.scenes[id];
  }

  function syncBackButton() {
    if (!els.backButton) {
      return;
    }

    els.backButton.disabled = historyStack.length === 0;
  }

  function resetToStart() {
    historyStack.length = 0;
    assignState(state, initialState);
    currentEntry = {
      kind: 'scene',
      id: data.startScene || 'start'
    };
  }

  function createOptionButton(label, handler) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sceneOption';
    button.textContent = String(label);
    button.addEventListener('click', handler);
    return button;
  }

  function renderScene(scene) {
    els.title.textContent = scene.title || data.caseTitle || 'Untitled case';
    els.body.innerHTML = '';
    els.options.innerHTML = '';

    createParagraphs(els.body, scene.body);
    renderBullets(els.bullets, scene.bullets);
    renderReflection(els.body, scene.reflection);

    (scene.options || []).forEach(function (option, index) {
      els.options.appendChild(createOptionButton(option.label, function () {
        if (option.resetHistory) {
          resetToStart();
          renderCurrent();
          return;
        }

        historyStack.push({
          entry: cloneValue(currentEntry),
          state: cloneValue(state)
        });

        mergeState(state, option.set);

        if (option.response) {
          currentEntry = {
            kind: 'response',
            sceneId: currentEntry.id,
            optionIndex: index
          };
        } else {
          currentEntry = {
            kind: 'scene',
            id: option.next
          };
        }

        renderCurrent();
      }));
    });
  }

  function renderResponse(scene, option) {
    const response = option.response || {};
    els.title.textContent = response.title || scene.title || data.caseTitle || 'Continue';
    els.body.innerHTML = '';
    els.options.innerHTML = '';

    createParagraphs(els.body, response.body);
    renderBullets(els.bullets, response.bullets);
    renderReflection(els.body, response.reflection);

    els.options.appendChild(createOptionButton(response.continueLabel || 'Continue', function () {
      if (option.resetHistoryOnContinue) {
        resetToStart();
        renderCurrent();
        return;
      }

      historyStack.push({
        entry: cloneValue(currentEntry),
        state: cloneValue(state)
      });

      currentEntry = {
        kind: 'scene',
        id: option.next
      };

      renderCurrent();
    }));
  }

  function renderCurrent() {
    if (els.banner && data.banner) {
      els.banner.textContent = data.banner;
    }

    if (currentEntry.kind === 'scene') {
      renderScene(getScene(currentEntry.id));
    } else {
      const scene = getScene(currentEntry.sceneId);
      renderResponse(scene, scene.options[currentEntry.optionIndex]);
    }

    syncBackButton();

    if (els.frame) {
      els.frame.scrollTop = 0;
    }
  }

  if (els.backButton) {
    els.backButton.addEventListener('click', function () {
      if (!historyStack.length) {
        return;
      }

      const previous = historyStack.pop();
      assignState(state, previous.state || {});
      currentEntry = previous.entry;
      renderCurrent();
    });
  }

  renderCurrent();
})();
