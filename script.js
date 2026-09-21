const viewer = document.getElementById('image-viewer');
const viewerImage = document.getElementById('viewer-image');
document.querySelectorAll('[data-image]').forEach(button => {
  button.addEventListener('click', () => {
    viewerImage.src = button.dataset.image;
    viewerImage.alt = button.querySelector('img').alt;
    const description = button.querySelector('.media-description');
    const output = document.getElementById('viewer-description');
    output.replaceChildren();
    output.hidden = !description;
    if (description) {
      const title = document.createElement('strong');
      title.textContent = description.querySelector('strong').textContent;
      output.append(title, document.createElement('br'), description.querySelector('span').textContent);
    }
    viewer.showModal();
  });
});
document.getElementById('close-viewer').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => { if (event.target === viewer) { const r=viewer.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)viewer.close(); }});
document.querySelectorAll('[data-report]').forEach(slot => {
  const path = (window.PORTFOLIO_REPORTS || {})[slot.dataset.report];
  if (!path) return;
  const url = new URL(path, location.href);
  if (!['https:', 'http:', 'file:'].includes(url.protocol)) return;
  slot.replaceChildren();
  const link = document.createElement('a');
  link.href = path; link.textContent = 'Open full design report (PDF) ↗';
  link.target = '_blank'; link.rel = 'noopener';
  const iframe = document.createElement('iframe');
  iframe.src = path; iframe.title = slot.closest('section').querySelector('h2').textContent + ' design report';
  iframe.loading = 'lazy'; slot.append(link, iframe);
});
// Keep the current project visible in the single sticky navigation bar.
const exploreNav = document.querySelector('.explore-nav');
const projectLinks = [...document.querySelectorAll('.explore-links a')];
const projectSections = [...document.querySelectorAll('.project-section')];
function updateExplore() {
  const edge = exploreNav.getBoundingClientRect().height + 35;
  let current = null;
  for (const section of projectSections) {
    if (section.getBoundingClientRect().top <= edge) current = section.id;
  }
  projectLinks.forEach(link => {
    if (link.hash === '#' + current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
let scrollQueued = false;
window.addEventListener('scroll', () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => { updateExplore(); scrollQueued = false; });
}, {passive:true});
window.addEventListener('resize', updateExplore);
updateExplore();

const videoViewer = document.getElementById('video-viewer');
const videoPlayer = document.getElementById('viewer-video');
document.querySelectorAll('[data-video]').forEach(button => {
  button.addEventListener('click', () => {
    const description = button.querySelector('.media-description');
    const titleText = description ? description.querySelector('strong').textContent : button.querySelector('img').alt;
    const output = document.getElementById('video-description');
    const title = document.createElement('strong');
    title.textContent = titleText;
    output.hidden = !description;
    if (description) output.replaceChildren(title, document.createElement('br'), description.querySelector('span').textContent);
    else output.replaceChildren();
    videoViewer.setAttribute('aria-label', titleText);
    videoPlayer.setAttribute('aria-label', titleText);
    videoPlayer.src = button.dataset.video;
    videoViewer.showModal();
    videoPlayer.play().catch(() => {});
  });
});
document.getElementById('close-video').addEventListener('click', () => videoViewer.close());
videoViewer.addEventListener('close', () => { videoPlayer.pause(); videoPlayer.removeAttribute('src'); videoPlayer.load(); });
videoViewer.addEventListener('click', event => {
  if (event.target !== videoViewer) return;
  const rect = videoViewer.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) videoViewer.close();
});

const posterViewer = document.getElementById('poster-viewer');
const posterFrame = document.getElementById('poster-frame');
document.querySelectorAll('[data-poster]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const title = link.querySelector('strong').textContent;
    posterFrame.title = title;
    posterFrame.src = link.href;
    document.getElementById('poster-open').href = link.href;
    posterViewer.showModal();
  });
});
document.getElementById('close-poster').addEventListener('click', () => posterViewer.close());
posterViewer.addEventListener('close', () => posterFrame.removeAttribute('src'));
