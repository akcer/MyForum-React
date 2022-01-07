export const replaceAvatarImgWithError = (e:any) => {
    e.target.onerror = null;
    e.target.srcset = '/default-avatar.png';
  };