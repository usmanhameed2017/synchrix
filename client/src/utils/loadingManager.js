// For Fetching Loader
let setLoadingFn = null;

export const setLoadingFunction = (fn) => {
    setLoadingFn = fn;
};

export const startLoading = () => {
    if(setLoadingFn) setLoadingFn(true);
};

export const stopLoading = () => {
    if(setLoadingFn) setLoadingFn(false);
};

// For Uploading Loader
let setSavingFn = null;

export const setSavingFunction = (fn) => {
    setSavingFn = fn;
};

export const startSaving = () => {
    if(setSavingFn) setSavingFn(true);
};

export const stopSaving = () => {
    if(setSavingFn) setSavingFn(false);
};