// PDF'i IndexedDB'ye kaydet
function savePDFToIndexedDB(file) {
    const request = indexedDB.open("PDFDatabase", 1);
  
    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      db.createObjectStore("pdfs", { keyPath: "id" });
    };
  
    request.onsuccess = function(event) {
      const db = event.target.result;
      const tx = db.transaction("pdfs", "readwrite");
      const store = tx.objectStore("pdfs");
  
      const reader = new FileReader();
      reader.onload = function(e) {
        const data = e.target.result;
        store.put({ id: "myPdf", content: data });
      };
      reader.readAsArrayBuffer(file);
    };
  }
  
  // IndexedDB'den PDF'i yükle
  function loadPDFfromIndexedDB(callback) {
    const request = indexedDB.open("PDFDatabase", 1);
  
    request.onsuccess = function(event) {
      const db = event.target.result;
      const tx = db.transaction("pdfs", "readonly");
      const store = tx.objectStore("pdfs");
  
      const getRequest = store.get("myPdf");
      getRequest.onsuccess = function() {
        if (getRequest.result) {
          callback(getRequest.result.content);
        } else {
          console.log("PDF bulunamadı.");
        }
      };
    }; 
  }
  
  // IndexedDB'den PDF'i sil
  function deletePDFfromIndexedDB() {
    const request = indexedDB.open("PDFDatabase", 1);
  
    request.onsuccess = function(event) {
      const db = event.target.result;
      const tx = db.transaction("pdfs", "readwrite");
      const store = tx.objectStore("pdfs");
  
      const deleteRequest = store.delete("myPdf");
  
      deleteRequest.onsuccess = function() {
        console.log("PDF başarıyla silindi.");
      };
  
      deleteRequest.onerror = function() {
        console.error("PDF silinirken bir hata oluştu.");
      };
    };
  }
  