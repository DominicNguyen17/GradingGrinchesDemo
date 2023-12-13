const downloadFile = async (url, filename) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const blob = await response.blob();
        const localUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = localUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(localUrl);
        document.body.removeChild(a);
    } catch (error) {
        console.error("There was a problem downloading the file", error);
    }
};

export default downloadFile;
