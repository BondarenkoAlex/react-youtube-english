export const getDocumentWidth = () => {
    var body = document.body, documentElement = document.documentElement;
    return Math.max(
        body.scrollWidth, documentElement.scrollWidth,
        body.offsetWidth, documentElement.offsetWidth,
        body.clientWidth, documentElement.clientWidth
    );
};
