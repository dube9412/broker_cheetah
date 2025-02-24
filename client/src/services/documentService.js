export const uploadDocument = async (formData) => {
    try {
      const res = await fetch('https://your-backend.com/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  };
  