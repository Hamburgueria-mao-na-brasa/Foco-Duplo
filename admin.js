const ADMIN_STORAGE_KEY = "foco-duplo-admin-content-v1";
const ADMIN_SESSION_KEY = "foco-duplo-admin-session-v1";
const ADMIN_GALLERY_KEY = "foco-duplo-gallery-overrides-v1";
const SUPABASE_URL = "https://uukdywfazqvewkwvrweq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_x9nZe7KgH4M1KiSN13rwWg_we5G4t1i";
const ADMIN_ALLOWED_EMAILS = [
  "williancarlos0103@gmail.com",
  "francasantosellen72@gmail.com",
];
const ADMIN_FALLBACK_PASSWORD_HASH = "21c11fbaab598c7fc8b9436fbd0238bc441027140f8ffbb363552bc13a3baa6c";
const ADMIN_SELECTOR = [
  ".logo-text strong",
  ".logo-text small",
  ".menu a",
  ".header-cta",
  ".badge",
  ".hero h1",
  ".hero-copy p",
  ".btn",
  ".mini-benefits span",
  ".card-header strong",
  ".section-title span",
  ".section-title h2",
  ".service-card small",
  ".service-card h3",
  ".service-card p",
  ".service-card em",
  ".portfolio-head span",
  ".portfolio-head h2",
  ".portfolio-open",
  ".project-card small",
  ".project-card h3",
  ".project-card p",
  ".project-card em",
  ".value-section h2",
  ".value-section li",
  ".packages-title span",
  ".packages-title h2",
  ".price-card h3",
  ".price-card p",
  ".price",
  ".price-card li",
  ".price-card a",
  ".note",
  ".final-text span",
  ".final-text h2",
  ".final-action p",
  ".final-action a",
  ".service-kicker",
  ".service-title",
  ".service-description",
  ".gallery-head span",
  ".gallery-head h2",
  ".gallery-head p",
  ".gallery-item span",
  ".person-head span",
  ".person-title",
  ".person-description",
  ".footer-center strong",
  ".footer-center p",
  ".footer-social a",
  ".footer-social span",
  ".whatsapp",
].join(",");

const adminEnabled = new URLSearchParams(window.location.search).get("admin") === "1";
const adminSupabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function isAdminLoggedIn() {
  if (sessionStorage.getItem(ADMIN_SESSION_KEY) === "ok") return true;
  if (!adminSupabase) return false;

  const { data } = await adminSupabase.auth.getSession();
  const email = data.session?.user?.email?.toLowerCase();
  const allowed = email && ADMIN_ALLOWED_EMAILS.includes(email);

  if (allowed) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "ok");
  }

  return Boolean(allowed);
}

function loadAdminContent() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveAdminContent(content) {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(content));
}

function getEditableElements() {
  return Array.from(document.querySelectorAll(ADMIN_SELECTOR));
}

function getImageElements() {
  return Array.from(document.querySelectorAll("img, .project-image"));
}

function elementKey(element, prefix) {
  const elements = prefix === "image" ? getImageElements() : getEditableElements();
  return `${prefix}:${elements.indexOf(element)}`;
}

function applyAdminContent() {
  const content = loadAdminContent();

  getEditableElements().forEach((element) => {
    const key = elementKey(element, "text");
    if (content[key] !== undefined) {
      element.innerHTML = content[key];
    }
  });

  getImageElements().forEach((element) => {
    const key = elementKey(element, "image");
    const value = content[key];
    if (!value) return;

    if (element.tagName === "IMG") {
      element.src = value;
      return;
    }

    element.style.backgroundImage = `linear-gradient(180deg, transparent 40%, rgba(3,5,12,.65)), url("${value}")`;
  });
}

function collectAdminContent() {
  const content = loadAdminContent();

  getEditableElements().forEach((element) => {
    content[elementKey(element, "text")] = element.innerHTML.trim();
  });

  getImageElements().forEach((element) => {
    const key = elementKey(element, "image");
    if (element.tagName === "IMG") {
      content[key] = element.getAttribute("src");
    } else {
      const match = element.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/);
      if (match) content[key] = match[1];
    }
  });

  saveAdminContent(content);
}

function setEditing(enabled) {
  document.body.classList.toggle("admin-editing", enabled);

  getEditableElements().forEach((element) => {
    element.contentEditable = String(enabled);
    element.spellcheck = true;
  });
}

function downloadAdminContent() {
  const blob = new Blob([JSON.stringify(loadAdminContent(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "foco-duplo-conteudo.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importAdminContent() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      try {
        saveAdminContent(JSON.parse(String(reader.result)));
        applyAdminContent();
        alert("Conteúdo importado com sucesso.");
      } catch {
        alert("Não foi possível importar esse arquivo.");
      }
    });
    reader.readAsText(file);
  });
  input.click();
}

function createAdminBar() {
  const bar = document.createElement("div");
  bar.className = "admin-bar";
  bar.innerHTML = `
    <strong>Admin ativo</strong>
    <span class="admin-hint">Clique nos textos para editar. Dê duplo clique nas imagens para trocar.</span>
    <button type="button" data-admin-action="photos">Fotos</button>
    <button type="button" data-admin-action="save">Salvar</button>
    <button type="button" data-admin-action="logout">Sair</button>
    <details class="admin-more">
      <summary>Avançado</summary>
      <button type="button" data-admin-action="export">Exportar</button>
      <button type="button" data-admin-action="import">Importar</button>
      <button type="button" data-admin-action="reset">Resetar</button>
    </details>
  `;

  bar.addEventListener("click", (event) => {
    const action = event.target?.dataset?.adminAction;
    if (!action) return;

    if (action === "save") {
      collectAdminContent();
      alert("Alterações salvas neste navegador.");
    }
    if (action === "photos") openPhotoManager();
    if (action === "export") {
      collectAdminContent();
      downloadAdminContent();
    }
    if (action === "import") importAdminContent();
    if (action === "reset" && confirm("Remover todas as alterações salvas neste navegador?")) {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      window.location.reload();
    }
    if (action === "logout") {
      adminSupabase?.auth?.signOut();
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      window.location.href = window.location.pathname;
    }
  });

  document.body.append(bar);
  setEditing(true);
}

function galleryLabels() {
  return window.focoDuploGalleryAdmin?.getGalleries?.() || {
    cacaue: "Cacauê",
    ana: "Ana",
    carlos: "Carlos",
    gilliel: "Gilliel",
    isa: "Isa",
    eventos: "Festas e casamentos",
  };
}

function openPhotoManager() {
  document.querySelector(".admin-photo-manager")?.remove();

  const labels = galleryLabels();
  const modal = document.createElement("div");
  modal.className = "admin-photo-manager";
  modal.innerHTML = `
    <div class="admin-photo-box">
      <button class="admin-photo-close" type="button" aria-label="Fechar">×</button>
      <span>Gerenciar fotos</span>
      <h2>Adicionar foto em uma aba</h2>
      <p>Coloque o arquivo na pasta do projeto e cole aqui o caminho. Exemplo: <strong>assets/galerias/eventos/foto-08.jpg</strong></p>
      <div class="admin-create-gallery">
        <h3>Criar nova aba no padrão Cacauê</h3>
        <label>
          Nome da aba
          <input name="new-title" type="text" placeholder="Ex: Eventos corporativos" />
        </label>
        <label>
          Descrição
          <input name="new-description" type="text" placeholder="Ex: Fotos de eventos, equipe e bastidores" />
        </label>
        <label>
          Pasta das fotos
          <input name="new-folder" type="text" placeholder="assets/galerias/eventos-corporativos" />
        </label>
        <div class="admin-gallery-pattern">
          <label>
            Prefixo
            <input name="new-prefix" type="text" placeholder="evento" />
          </label>
          <label>
            Quantidade
            <input name="new-count" type="number" min="1" max="80" value="5" />
          </label>
          <label>
            Extensão
            <select name="new-extension">
              <option value="jpg">jpg</option>
              <option value="jpeg">jpeg</option>
              <option value="png">png</option>
              <option value="webp">webp</option>
            </select>
          </label>
        </div>
        <button class="admin-gallery-add" type="button">Criar aba</button>
        <p class="admin-pattern-help">Exemplo: pasta <strong>assets/galerias/eventos</strong>, prefixo <strong>evento</strong>, quantidade <strong>3</strong> cria evento-01.jpg, evento-02.jpg e evento-03.jpg.</p>
      </div>
      <label>
        Aba
        <select name="gallery">
          ${Object.entries(labels).map(([key, label]) => `<option value="${key}">${label}</option>`).join("")}
        </select>
      </label>
      <label>
        Caminho da foto
        <input name="path" type="text" placeholder="assets/galerias/ana/nova-foto.jpg" />
      </label>
      <label>
        Legenda
        <input name="caption" type="text" placeholder="Ex: Ensaio Ana - foto externa" />
      </label>
      <button class="admin-photo-add" type="button">Adicionar foto</button>
      <div class="admin-gallery-list"></div>
      <div class="admin-photo-list"></div>
    </div>
  `;

  const close = () => modal.remove();
  const refresh = () => renderPhotoManagerList(modal);

  modal.querySelector(".admin-photo-close").addEventListener("click", close);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });

  modal.querySelector(".admin-photo-add").addEventListener("click", () => {
    const gallery = modal.querySelector("[name='gallery']").value;
    const path = modal.querySelector("[name='path']").value.trim();
    const caption = modal.querySelector("[name='caption']").value.trim();

    if (!path) {
      alert("Digite o caminho da foto.");
      return;
    }

    const ok = window.focoDuploGalleryAdmin?.addPhoto?.(gallery, { src: path, caption });
    if (!ok) {
      alert("Não foi possível adicionar nessa aba.");
      return;
    }

    modal.querySelector("[name='path']").value = "";
    modal.querySelector("[name='caption']").value = "";
    refresh();
    alert("Foto adicionada. Abra a galeria para conferir.");
  });

  modal.querySelector(".admin-gallery-add").addEventListener("click", () => {
    const title = modal.querySelector("[name='new-title']").value.trim();
    const description = modal.querySelector("[name='new-description']").value.trim();
    const folder = modal.querySelector("[name='new-folder']").value.trim().replace(/[\\/]+$/, "");
    const prefix = modal.querySelector("[name='new-prefix']").value.trim();
    const count = Number(modal.querySelector("[name='new-count']").value);
    const extension = modal.querySelector("[name='new-extension']").value;

    if (!title) {
      alert("Digite o nome da nova aba.");
      return;
    }

    if (!folder || !prefix || !count) {
      alert("Preencha pasta, prefixo e quantidade de fotos.");
      return;
    }

    const photos = Array.from({ length: count }, (_, index) => {
      const number = String(index + 1).padStart(2, "0");
      return {
        src: `${folder}/${prefix}-${number}.${extension}`,
        caption: `${title} - foto ${index + 1}`,
      };
    });

    const key = window.focoDuploGalleryAdmin?.addGallery?.({
      title,
      description,
      cover: photos[0]?.src || "",
      photos,
      category: "Galeria",
    });

    if (!key) {
      alert("Não foi possível criar essa aba.");
      return;
    }

    modal.querySelector("[name='new-title']").value = "";
    modal.querySelector("[name='new-description']").value = "";
    modal.querySelector("[name='new-folder']").value = "";
    modal.querySelector("[name='new-prefix']").value = "";
    modal.querySelector("[name='new-count']").value = "5";
    refresh();
    modal.querySelector("[name='gallery']").value = key;
    alert("Aba criada. Agora você pode adicionar mais fotos nela.");
  });

  document.body.append(modal);
  refresh();
}

function renderPhotoManagerList(modal) {
  const list = modal.querySelector(".admin-photo-list");
  const galleryList = modal.querySelector(".admin-gallery-list");
  const select = modal.querySelector("[name='gallery']");
  const labels = galleryLabels();
  const added = window.focoDuploGalleryAdmin?.getAddedPhotos?.() || {};
  const custom = window.focoDuploGalleryAdmin?.getCustomGalleries?.() || {};

  select.innerHTML = Object.entries(labels)
    .map(([key, label]) => `<option value="${key}">${label}</option>`)
    .join("");

  if (Object.keys(custom).length) {
    galleryList.innerHTML = `
      <h3>Abas criadas pelo admin</h3>
      ${Object.entries(custom).map(([key, gallery]) => `
        <div class="admin-gallery-row">
          <div>
            <strong>${gallery.title}</strong>
            <small>${gallery.description || "Sem descrição"}</small>
          </div>
          <button type="button" data-remove-gallery="${key}">Remover aba</button>
        </div>
      `).join("")}
    `;
  } else {
    galleryList.innerHTML = "";
  }

  galleryList.querySelectorAll("[data-remove-gallery]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!confirm("Remover esta aba e as fotos adicionadas nela?")) return;
      window.focoDuploGalleryAdmin?.removeGallery?.(button.dataset.removeGallery);
      renderPhotoManagerList(modal);
    });
  });

  const rows = Object.entries(labels).flatMap(([galleryKey, label]) => {
    const photos = added[galleryKey] || [];
    return photos.map((photo, index) => ({ galleryKey, label, photo, index }));
  });

  if (!rows.length) {
    list.innerHTML = "<p>Nenhuma foto adicionada pelo admin ainda.</p>";
    return;
  }

  list.innerHTML = rows.map((row) => `
    <div class="admin-photo-row">
      <img src="${row.photo.src}" alt="">
      <div>
        <strong>${row.label}</strong>
        <small>${row.photo.caption || "Sem legenda"}</small>
        <code>${row.photo.src}</code>
      </div>
      <button type="button" data-gallery="${row.galleryKey}" data-index="${row.index}">Remover</button>
    </div>
  `).join("");

  list.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      window.focoDuploGalleryAdmin?.removeAddedPhoto?.(button.dataset.gallery, Number(button.dataset.index));
      renderPhotoManagerList(modal);
    });
  });
}

function createAdminLogin() {
  const overlay = document.createElement("div");
  overlay.className = "admin-login";
  overlay.innerHTML = `
    <form class="admin-login-box">
      <span>Área administrativa</span>
      <h2>Entrar no modo admin</h2>
      <p>Use um e-mail autorizado para editar textos e imagens do site.</p>
      <label>
        E-mail
        <input type="email" name="email" autocomplete="username" required />
      </label>
      <label>
        Senha
        <input type="password" name="password" autocomplete="current-password" required />
      </label>
      <strong class="admin-login-error" aria-live="polite"></strong>
      <button type="submit">Entrar</button>
      <a href="${window.location.pathname}">Voltar ao site</a>
    </form>
  `;

  overlay.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const error = form.querySelector(".admin-login-error");

    if (!ADMIN_ALLOWED_EMAILS.includes(email)) {
      error.textContent = "Este e-mail não tem permissão para acessar o admin.";
      return;
    }

    error.textContent = "Entrando...";

    let loginError = null;

    if (adminSupabase) {
      const result = await adminSupabase.auth.signInWithPassword({ email, password });
      loginError = result.error;
    } else {
      loginError = new Error("Supabase não carregou.");
    }

    if (loginError) {
      try {
        const passwordHash = await sha256(password);
        if (passwordHash !== ADMIN_FALLBACK_PASSWORD_HASH) {
          error.textContent = "E-mail ou senha inválidos.";
          return;
        }
      } catch {
        error.textContent = "Não foi possível validar o login neste navegador.";
        return;
      }
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, "ok");
    overlay.remove();
    createAdminBar();
    enableImageEditing();
  });

  document.body.append(overlay);
}

function enableImageEditing() {
  getImageElements().forEach((element) => {
    element.title = "Modo admin: dê duplo clique para trocar esta imagem";
    element.addEventListener("dblclick", (event) => {
      if (!document.body.classList.contains("admin-editing")) return;
      event.preventDefault();
      event.stopPropagation();
      const current = element.tagName === "IMG" ? element.getAttribute("src") : "";
      const next = prompt("Digite o caminho da nova imagem:", current || "assets/galerias/nome/foto.jpg");
      if (!next) return;

      if (element.tagName === "IMG") {
        element.src = next;
      } else {
        element.style.backgroundImage = `linear-gradient(180deg, transparent 40%, rgba(3,5,12,.65)), url("${next}")`;
      }
    });
  });
}

applyAdminContent();

if (adminEnabled) {
  (async () => {
    if (await isAdminLoggedIn()) {
    createAdminBar();
    enableImageEditing();
  } else {
    createAdminLogin();
  }
  })();
}
