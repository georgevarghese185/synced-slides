const slideUrl = slide => {
  return `/api/slides/image/${slide.uuid}`;
};

module.exports = {
  slideUrl,
};
