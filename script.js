const body = document.body;
const GALLERY_OVERRIDES_KEY = "foco-duplo-gallery-overrides-v1";
const CUSTOM_GALLERIES_KEY = "foco-duplo-custom-galleries-v1";
const menuButton = document.querySelector(".menu-button");
const menuLinks = document.querySelectorAll(".menu a");

function lockPage() {
  body.classList.add("modal-open");
  body.style.overflow = "hidden";
}

function unlockPage() {
  body.classList.remove("modal-open");
  body.style.overflow = "";
}

function unlockPageIfNoModal() {
  const hasOpenModal = document.querySelector(".gallery-modal.open, .person-modal.open, .service-modal.open, .lightbox.open");
  if (!hasOpenModal) {
    unlockPage();
  }
}

menuButton?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

const sections = document.querySelectorAll("section[id], header[id]");
const navLinks = document.querySelectorAll(".menu a");

window.addEventListener("scroll", () => {
  let current = "inicio";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 130;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}, { passive: true });

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");

function openLightbox(src, caption) {
  if (!lightbox || !lightboxImage) return;
  lightboxImage.src = src;
  lightboxImage.alt = caption || "Imagem do portfólio";
  if (lightboxCaption) lightboxCaption.textContent = caption || "";
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  lockPage();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  if (lightboxImage) lightboxImage.src = "";
  unlockPageIfNoModal();
}

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

const galleryTriggers = document.querySelectorAll(".gallery-trigger");
const galleryModal = document.querySelector(".gallery-modal");
const galleryClose = document.querySelector(".gallery-close");

function openGallery() {
  if (!galleryModal) return;
  galleryModal.classList.add("open");
  galleryModal.setAttribute("aria-hidden", "false");
  lockPage();
}

function closeGallery() {
  if (!galleryModal) return;
  galleryModal.classList.remove("open");
  galleryModal.setAttribute("aria-hidden", "true");
  unlockPageIfNoModal();
}

galleryTriggers.forEach((trigger) => {
  trigger.addEventListener("click", openGallery);
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openGallery();
    }
  });
});

galleryClose?.addEventListener("click", closeGallery);
galleryModal?.addEventListener("click", (event) => {
  if (event.target === galleryModal) {
    closeGallery();
  }
});

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    openLightbox(item.dataset.image, item.dataset.caption || "");
  });
});

const personData = {
  cacaue: {
    title: "Cacauê",
    description: "Fotografia gastronômica com foco em textura, recheio, processo e desejo de compra.",
    photos: [
      "assets/galerias/cacaue/cacaue-01.jpg",
      "assets/galerias/cacaue/cacaue-02.jpg",
      "assets/galerias/cacaue/cacaue-03.jpg",
      "assets/galerias/cacaue/cacaue-04.jpeg",
      "assets/galerias/cacaue/cacaue-05.jpeg",
    ],
  },
  ana: {
    title: "Ana",
    description: "Ensaio com direção de luz, enquadramento e presença para conteúdo profissional.",
    photos: [
      "assets/galerias/ana/ana-01.jpg",
      "assets/galerias/ana/ana-02.jpg",
      "assets/galerias/ana/ana-03.jpg",
      "assets/galerias/ana/ana-04.jpg",
      "assets/galerias/ana/ana-05.jpg",
    ],
  },
  carlos: {
    title: "Carlos",
    description: "Retratos para autoridade, posicionamento e presença digital.",
    photos: [
      "assets/galerias/carlos/carlos-01.jpg",
      "assets/galerias/carlos/carlos-02.jpg",
      "assets/galerias/carlos/carlos-03.jpg",
      "assets/galerias/carlos/carlos-04.jpg",
    ],
  },
  gilliel: {
    title: "Gilliel",
    description: "Fotos com estética, postura e intenção para valorizar a imagem.",
    photos: [
      "assets/galerias/gilliel/gilliel-01.jpg",
      "assets/galerias/gilliel/gilliel-02.jpg",
      "assets/galerias/gilliel/gilliel-03.jpg",
      "assets/galerias/gilliel/gilliel-04.jpg",
    ],
  },
  isa: {
    title: "Isa",
    description: "Conteúdo visual para redes sociais, campanhas e divulgação.",
    photos: [
      "assets/galerias/isa/isa-01.jpg",
      "assets/galerias/isa/isa-02.jpg",
      "assets/galerias/isa/isa-03.jpg",
      "assets/galerias/isa/isa-04.jpg",
      "assets/galerias/isa/isa-05.jpg",
    ],
  },
  eventos: {
    title: "Festas e casamentos",
    description: "Registros de eventos com foco em emoção, detalhes, pessoas e momentos importantes.",
    photos: [
      "assets/gallery/foto-01.jpg",
      "assets/gallery/foto-02.jpg",
      "assets/gallery/foto-04.jpg",
      "assets/gallery/foto-05.jpg",
      "assets/gallery/foto-18.jpg",
      "assets/gallery/foto-19.jpg",
      "assets/gallery/foto-20.jpg",
    ],
  },
};

function loadGalleryOverrides() {
  try {
    return JSON.parse(localStorage.getItem(GALLERY_OVERRIDES_KEY)) || {};
  } catch {
    return {};
  }
}

function saveGalleryOverrides(overrides) {
  localStorage.setItem(GALLERY_OVERRIDES_KEY, JSON.stringify(overrides));
}

function loadCustomGalleries() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_GALLERIES_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCustomGalleries(galleries) {
  localStorage.setItem(CUSTOM_GALLERIES_KEY, JSON.stringify(galleries));
}

function slugifyGalleryName(name) {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "galeria";
  const galleries = getAllGalleryData();
  let slug = base;
  let count = 2;

  while (galleries[slug]) {
    slug = `${base}-${count}`;
    count += 1;
  }

  return slug;
}

function getAllGalleryData() {
  return {
    ...personData,
    ...loadCustomGalleries(),
  };
}

function normalizePhoto(photo) {
  if (typeof photo === "string") {
    return { src: photo, caption: "" };
  }

  return {
    src: photo.src,
    caption: photo.caption || "",
  };
}

function getGalleryPhotos(key) {
  const galleries = getAllGalleryData();
  const basePhotos = galleries[key]?.photos || [];
  const overrides = loadGalleryOverrides();
  const addedPhotos = overrides[key] || [];
  return [...basePhotos, ...addedPhotos].map(normalizePhoto).filter((photo) => photo.src);
}

const personModal = document.querySelector(".person-modal");
const personClose = document.querySelector(".person-close");
const personTitle = document.querySelector(".person-title");
const personDescription = document.querySelector(".person-description");
const personGrid = document.querySelector(".person-grid");

function openPersonGallery(key) {
  const data = getAllGalleryData()[key];
  if (!data || !personModal || !personGrid) return;

  personTitle.textContent = data.title;
  personDescription.textContent = data.description;
  personGrid.innerHTML = "";

  getGalleryPhotos(key).forEach((photo, index) => {
    const button = document.createElement("button");
    const image = document.createElement("img");
    const label = document.createElement("span");
    const caption = photo.caption || `${data.title} - foto ${index + 1}`;

    button.className = "person-item";
    button.type = "button";
    button.dataset.image = photo.src;
    button.dataset.caption = caption;
    image.src = photo.src;
    image.alt = caption;
    label.textContent = `Foto ${String(index + 1).padStart(2, "0")}`;

    button.append(image, label);
    button.addEventListener("click", () => openLightbox(photo.src, caption));
    personGrid.append(button);
  });

  personModal.classList.add("open");
  personModal.setAttribute("aria-hidden", "false");
  lockPage();
}

function closePersonGallery() {
  if (!personModal) return;
  personModal.classList.remove("open");
  personModal.setAttribute("aria-hidden", "true");
  unlockPageIfNoModal();
}

function bindGalleryCards() {
  document.querySelectorAll("[data-person-gallery]").forEach((card) => {
    if (card.dataset.galleryBound === "true") return;
    card.dataset.galleryBound = "true";
    card.addEventListener("click", () => openPersonGallery(card.dataset.personGallery));
  });
}

function renderCustomGalleryCards() {
  const grid = document.querySelector(".photo-projects-page");
  if (!grid) return;

  grid.querySelectorAll(".dynamic-gallery-card").forEach((card) => card.remove());

  Object.entries(loadCustomGalleries()).forEach(([key, gallery]) => {
    const cover = gallery.cover || normalizePhoto(gallery.photos?.[0] || {}).src || "assets/gallery/foto-01.jpg";
    const card = document.createElement("button");
    card.className = "project-card person-card dynamic-gallery-card";
    card.type = "button";
    card.dataset.personGallery = key;
    card.innerHTML = `
      <div class="project-image"></div>
      <div>
        <small>${gallery.category || "Galeria"}</small>
        <h3>${gallery.title}</h3>
        <p>${gallery.description || "Galeria personalizada criada pelo admin."}</p>
        <em>Ver galeria</em>
      </div>
    `;
    card.querySelector(".project-image").style.backgroundImage = `linear-gradient(180deg, transparent 40%, rgba(3,5,12,.65)), url("${cover}")`;
    grid.append(card);
  });

  bindGalleryCards();
}

renderCustomGalleryCards();
bindGalleryCards();

window.focoDuploGalleryAdmin = {
  getGalleries() {
    return Object.fromEntries(
      Object.entries(getAllGalleryData()).map(([key, value]) => [key, value.title])
    );
  },
  getCustomGalleries() {
    return loadCustomGalleries();
  },
  getAddedPhotos() {
    return loadGalleryOverrides();
  },
  addGallery({ title, description, cover, category, photos }) {
    if (!title) return null;
    const key = slugifyGalleryName(title);
    const custom = loadCustomGalleries();
    custom[key] = {
      title,
      description: description || "Galeria personalizada criada pelo admin.",
      category: category || "Galeria",
      cover: cover || "",
      photos: photos?.length ? photos : (cover ? [{ src: cover, caption: title }] : []),
    };
    saveCustomGalleries(custom);
    renderCustomGalleryCards();
    return key;
  },
  removeGallery(key) {
    const custom = loadCustomGalleries();
    delete custom[key];
    saveCustomGalleries(custom);
    const overrides = loadGalleryOverrides();
    delete overrides[key];
    saveGalleryOverrides(overrides);
    renderCustomGalleryCards();
  },
  addPhoto(key, photo) {
    if (!getAllGalleryData()[key]) return false;
    const overrides = loadGalleryOverrides();
    overrides[key] = overrides[key] || [];
    overrides[key].push(photo);
    saveGalleryOverrides(overrides);
    return true;
  },
  removeAddedPhoto(key, index) {
    const overrides = loadGalleryOverrides();
    if (!overrides[key]) return;
    overrides[key].splice(index, 1);
    saveGalleryOverrides(overrides);
  },
};

personClose?.addEventListener("click", closePersonGallery);
personModal?.addEventListener("click", (event) => {
  if (event.target === personModal) {
    closePersonGallery();
  }
});

const serviceData = {
  instagram: {
    title: "Gestão de Instagram",
    description: "Organizamos a presença da sua marca no Instagram com conteúdo estratégico, visual profissional e comunicação pensada para gerar desejo, confiança e conversas no WhatsApp.",
    deliverables: [
      "Planejamento de conteúdo",
      "Artes profissionais para feed e stories",
      "Legendas com chamada para ação",
      "Organização de bio e destaques",
      "Linha visual alinhada à marca",
    ],
    ideal: [
      "Negócios locais",
      "Restaurantes e confeitarias",
      "Lojas e prestadores de serviço",
      "Marcas que querem parecer mais profissionais",
    ],
    whatsapp: "https://wa.me/5564992360895?text=Ol%C3%A1%2C%20Foco%20Duplo!%20Quero%20saber%20mais%20sobre%20Gest%C3%A3o%20de%20Instagram.",
  },
  sites: {
    title: "Criação de Sites",
    description: "Criamos sites modernos, rápidos e responsivos para apresentar sua marca de forma premium e transformar visitantes em contatos reais pelo WhatsApp.",
    deliverables: [
      "Landing page profissional",
      "Site responsivo para celular e computador",
      "Botões de contato direto",
      "Design premium personalizado",
      "Estrutura pensada para conversão",
    ],
    ideal: [
      "Empresas que precisam de presença profissional",
      "Marcas que vendem por WhatsApp",
      "Negócios que querem catálogo ou portfólio",
      "Clientes que desejam sair do básico",
    ],
    whatsapp: "https://wa.me/5564992360895?text=Ol%C3%A1%2C%20Foco%20Duplo!%20Quero%20saber%20mais%20sobre%20Cria%C3%A7%C3%A3o%20de%20Sites.",
  },
  fotografia: {
    title: "Fotografia Profissional",
    description: "Produzimos imagens com direção, captação e tratamento para fortalecer a percepção de valor da sua marca. A entrega pode incluir fotos para produtos, gastronomia, marcas pessoais, campanhas, redes sociais, sites e materiais de divulgação.",
    deliverables: [
      "Direção de cena e enquadramento",
      "Captação profissional das imagens",
      "Seleção das melhores fotos",
      "Tratamento e ajuste de cor",
      "Arquivos prontos para redes sociais, site e campanhas",
    ],
    ideal: [
      "Confeitarias e restaurantes",
      "Produtos e catálogos",
      "Marcas pessoais",
      "Empresas que precisam parecer mais profissionais",
    ],
    whatsapp: "https://wa.me/5564992360895?text=Ol%C3%A1%2C%20Foco%20Duplo!%20Quero%20saber%20mais%20sobre%20Fotografia%20Profissional.",
    photos: true,
  },
  reels: {
    title: "Vídeos e Reels",
    description: "Produzimos vídeos curtos com estética profissional, ritmo e intenção. Conteúdos feitos para prender atenção e fortalecer a percepção de valor da marca.",
    deliverables: [
      "Roteiro e direção criativa",
      "Captação de cenas",
      "Edição dinâmica",
      "Vídeos para Reels, Stories e anúncios",
      "Chamadas pensadas para engajamento",
    ],
    ideal: [
      "Marcas que querem mais alcance",
      "Produtos que precisam ser demonstrados",
      "Eventos e lançamentos",
      "Negócios que querem gerar desejo",
    ],
    whatsapp: "https://wa.me/5564992360895?text=Ol%C3%A1%2C%20Foco%20Duplo!%20Quero%20saber%20mais%20sobre%20V%C3%ADdeos%20e%20Reels.",
  },
  identidade: {
    title: "Identidade Visual",
    description: "Construímos uma estética forte para sua marca ser reconhecida com facilidade, transmitir confiança e criar uma presença visual mais memorável.",
    deliverables: [
      "Direção visual da marca",
      "Paleta de cores",
      "Estilo de artes e elementos",
      "Padronização para redes sociais",
      "Aplicações visuais para comunicação",
    ],
    ideal: [
      "Marcas novas",
      "Empresas que precisam reposicionar a imagem",
      "Negócios com visual desorganizado",
      "Quem quer parecer mais premium",
    ],
    whatsapp: "https://wa.me/5564992360895?text=Ol%C3%A1%2C%20Foco%20Duplo!%20Quero%20saber%20mais%20sobre%20Identidade%20Visual.",
  },
  eventos: {
    title: "Eventos",
    description: "Registramos festas, casamentos, aniversários e eventos especiais com olhar profissional para emoção, detalhes, decoração, pessoas e momentos espontâneos.",
    deliverables: [
      "Cobertura fotográfica do evento",
      "Registro de detalhes, decoração e ambiente",
      "Fotos de convidados, família e momentos especiais",
      "Seleção das melhores imagens",
      "Tratamento e entrega digital das fotos",
    ],
    ideal: [
      "Casamentos",
      "Aniversários e festas infantis",
      "Eventos corporativos",
      "Celebrações familiares",
    ],
    whatsapp: "https://wa.me/5564992360895?text=Ol%C3%A1%2C%20Foco%20Duplo!%20Quero%20saber%20mais%20sobre%20cobertura%20de%20eventos.",
  },
};

const serviceModal = document.querySelector(".service-modal");
const serviceClose = document.querySelector(".service-close");
const serviceTitle = document.querySelector(".service-title");
const serviceDescription = document.querySelector(".service-description");
const serviceDeliverables = document.querySelector(".service-deliverables");
const serviceIdeal = document.querySelector(".service-ideal");
const serviceWhatsapp = document.querySelector(".service-whatsapp");

let servicePhotosButton = null;

function fillList(element, items) {
  if (!element) return;
  element.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    element.appendChild(li);
  });
}

function openServiceModal(serviceKey) {
  const data = serviceData[serviceKey];
  if (!data || !serviceModal) return;

  serviceTitle.textContent = data.title;
  serviceDescription.textContent = data.description;
  fillList(serviceDeliverables, data.deliverables);
  fillList(serviceIdeal, data.ideal);
  serviceWhatsapp.href = data.whatsapp;

  servicePhotosButton?.remove();
  servicePhotosButton = null;

  if (data.photos) {
    servicePhotosButton = document.createElement("button");
    servicePhotosButton.type = "button";
    servicePhotosButton.className = "service-photos";
    servicePhotosButton.textContent = "Ver fotos e cases";
    servicePhotosButton.addEventListener("click", () => {
      closeServiceModal();
      document.querySelector("#fotos")?.scrollIntoView({ behavior: "smooth" });
    });
    serviceWhatsapp.insertAdjacentElement("afterend", servicePhotosButton);
  }

  serviceModal.classList.add("open");
  serviceModal.setAttribute("aria-hidden", "false");
  lockPage();
}

function closeServiceModal() {
  if (!serviceModal) return;
  serviceModal.classList.remove("open");
  serviceModal.setAttribute("aria-hidden", "true");
  unlockPageIfNoModal();
}

document.querySelectorAll(".service-trigger").forEach((card) => {
  card.addEventListener("click", () => openServiceModal(card.dataset.service));

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openServiceModal(card.dataset.service);
    }
  });
});

serviceClose?.addEventListener("click", closeServiceModal);
serviceModal?.addEventListener("click", (event) => {
  if (event.target === serviceModal) {
    closeServiceModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeGallery();
  closePersonGallery();
  closeLightbox();
  closeServiceModal();
});
