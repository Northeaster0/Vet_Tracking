import { useState, useEffect } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchResult {
  name: string;
  type: 'folder' | 'file';
  path?: string;
  isFolder: boolean;
  snippet?: string; // Eğer gerekiyorsa
}

// FileItem tipi
interface FileItem {
  name: string;
  type: "file";
  path: string;
  isFolder: false;  // Dosya için false
  snippet?: string;  // Eğer snippet gerekiyorsa, burada da opsiyonel
}

// FolderItem tipi
interface FolderItem {
  name: string;
  type: "folder";
  path: string;
  isFolder: true; // Klasör için true
  children: (FileItem | FolderItem)[];  // Çocuklar hem FileItem hem de FolderItem olabilir
  snippet?: string;  // Eğer snippet gerekiyorsa, burada da opsiyonel
}

const initialData: FolderItem = {
  name: "Raporlar",
  type: "folder",
  path: "../../../Raporlar",
  isFolder: true,
  children: [
    {
      name: "Biyokimya",
      type: "folder",
      path: "../../../Raporlar/Biyokimya",
      isFolder: true,
      children: [
        { name: "VETERİNER BİYOKİMYA LABORATUVAR SONUÇ RAPORU.pdf", type: "file", path: "../../../Raporlar/Biyokimya/VETERİNER BİYOKİMYA LABORATUVAR SONUÇ RAPORU.pdf", isFolder: false },
      ]
    },
    {
      name: "Cerrahi",
      type: "folder",
      path: "../../../Raporlar/cerrahi",
      isFolder: true,
      children: [
        { name: "ameliyat_raporu.pdf", type: "file", path: "../../../Raporlar/cerrahi/ameliyat_raporu.pdf", isFolder: false },
        { name: "postop_takip.pdf", type: "file", path: "../../../Raporlar/cerrahi/postop_takip.pdf", isFolder: false },
      ]
    },
    {
      name: "Dahiliye",
      type: "folder",
      path: "../../../Raporlar/dahiliye",
      isFolder: true,
      children: [
        { name: "genel_muayene.pdf", type: "file", path: "../../../Raporlar/dahiliye/genel_muayene.pdf", isFolder: false },
        { name: "kronik_hastalik.pdf", type: "file", path: "../../../Raporlar/dahiliye/kronik_hastalik.pdf", isFolder: false },
      ]
    },
    {
      name: "Diğer",
      type: "folder",
      path: "../../../Raporlar/diger",
      isFolder: true,
      children: [
        { name: "konsultasyon.pdf", type: "file", path: "../../../Raporlar/diger/konsultasyon.pdf", isFolder: false },
      ]
    },
    {
      name: "Doğum ve Jinekoloji",
      type: "folder",
      path: "../../../Raporlar/dogum_jinekoloji",
      isFolder: true,
      children: [
        { name: "ultrason.pdf", type: "file", path: "../../../Raporlar/dogum_jinekoloji/ultrason.pdf", isFolder: false },
        { name: "dogum_raporu.pdf", type: "file", path: "../../../Raporlar/dogum_jinekoloji/dogum_raporu.pdf", isFolder: false },
      ]
    },
    {
      name: "Patoloji",
      type: "folder",
      path: "../../../Raporlar/patoloji",
      isFolder: true,
      children: [
        { name: "biyopsi.pdf", type: "file", path: "../../../Raporlar/patoloji/biyopsi.pdf", isFolder: false },
        { name: "doku_inceleme.pdf", type: "file", path: "../../../Raporlar/patoloji/doku_inceleme.pdf", isFolder: false },
      ]
    }
  ]
};



export default function PatientReports() {
  // Arama fonksiyonu için state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [data, setData] = useState<FolderItem>(initialData);
  const [expandedFolders, setExpandedFolders] = useState<{ [folderName: string]: boolean }>({
    "Raporlar": true
  });
  

  // Gerçek uygulamada burada API'dan veri çekilebilir
  useEffect(() => {
    // API çağrısı burada yapılabilir
    // const fetchData = async () => {
    //   const response = await fetch('/api/files');
    //   const data = await response.json();
    //   setData(data);
    // };
    // fetchData();
  }, []);

  // Arama işlevi
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [];
    const searchInFolder = (folder: FolderItem, parentPath: string = "") => {
      // Klasör yolunu oluştur
      const folderPath = parentPath ? `${parentPath}/${folder.name}` : folder.name;
      
      // Klasör isimlerinde ara
      if (folder.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({
          name: folder.name,
          type: "folder",
          path: folderPath,
          isFolder: true
        });
      }

      // Dosyalarda ara
      if (folder.children) {
        for (const child of folder.children) {
          if (child.type === 'folder') {
            searchInFolder(child as FolderItem, folderPath);
          } else if (child.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({
              name: child.name,
              type: "file",
              path: child.path || '',
              isFolder: false
            });
          }
        }
      }
    };

    searchInFolder(data);
    setSearchResults(results);
  }, [searchTerm, data]);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders({
      ...expandedFolders,
      [folderName]: !expandedFolders[folderName]
    });
  };

  const selectFile = (file: FileItem) => {
    setSelectedFile(file);
  };

  const FolderComponent = ({ folder, level = 0 }: { folder: FolderItem; level?: number }) => {
    // Tüm tıbbi raporlar klasörlerini varsayılan olarak göster
    if (folder.name === "Raporlar" && !expandedFolders.hasOwnProperty(folder.name)) {
      setTimeout(() => {
        setExpandedFolders(prev => ({...prev, [folder.name]: true}));
      }, 0);
    }
    const isExpanded = expandedFolders[folder.name] || false;
    
    return (
      <div className="select-none">
        <div 
          className="flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => toggleFolder(folder.name)}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {isExpanded ? (
            <ChevronDown size={16} className="text-gray-500 mr-1" />
          ) : (
            <ChevronRight size={16} className="text-gray-500 mr-1" />
          )}
          <Folder size={18} className="text-blue-500 mr-2" />
          <span className="text-sm font-medium">{folder.name}</span>
        </div>
        
        {isExpanded && folder.children && (
          <div>
            {folder.children.map((child, index) => (
              <div key={index}>
                {child.type === 'folder' ? (
                  <FolderComponent folder={child} level={level + 1} />
                ) : (
                  <FileComponent file={child} level={level + 1} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const FileComponent = ({ file, level }: { file: FileItem; level: number }) => {
    const isSelected = selectedFile && selectedFile.path === file.path;
    
    return (
      <div
        className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer ${
          isSelected ? 'bg-blue-100' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => selectFile(file)}
      >
        <File size={18} className="text-gray-500 mr-2 ml-5" />
        <span className="text-sm">{file.name}</span>
        <Eye 
          size={16} 
          className="ml-auto text-gray-400 hover:text-gray-700" 
          onClick={(e) => {
            e.stopPropagation();
            selectFile(file);
          }}
        />
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sol taraf - Dosya gezgini */}
      <div className="w-1/4 bg-white border-r border-gray-200 overflow-auto">
        <div className="p-3 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Tıbbi Raporlar</h2>
          <Link
            to="/patient-dashboard"
            className="bg-[#d68f13] text-white px-4 py-2 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <span>←</span>
            <span>Geri Dön</span>
          </Link>
        </div>
        <div className="p-2 border-b border-gray-200">
          <input
            type="text"
            placeholder="Rapor ara..."
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Arama sonuçları */}
        {searchTerm && searchResults.length > 0 ? (
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 mb-2 px-2">
              Arama sonuçları ({searchResults.length})
            </div>
            {searchResults.map((item, index) => (
              <div 
                key={index}
                className="flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer rounded"
                onClick={() => item.type ? 
                  toggleFolder(item.name) : 
                  selectFile(item as FileItem)
                }
              >
                {item.isFolder ? (
                  <Folder size={16} className="text-blue-500 mr-2" />
                ) : (
                  <File size={16} className="text-gray-500 mr-2" />
                )}
                <span className="text-sm truncate">{item.name}</span>
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            Arama sonucu bulunamadı
          </div>
        ) : (
          <div className="p-2">
            <FolderComponent folder={data} />
          </div>
        )}
      </div>
      
      {/* Sağ taraf - PDF görüntüleyici */}
      <div className="w-3/4 p-4">
        {selectedFile ? (
          <div className="h-full flex flex-col">
            <div className="mb-4 pb-2 border-b border-gray-200">
              <h3 className="text-lg font-medium">{selectedFile.name}</h3>
              <p className="text-sm text-gray-500">{selectedFile.path}</p>
            </div>
            
            <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center">
              {/* Gerçek uygulamada burada bir PDF görüntüleyici olacak */}
              <div className="h-full w-full p-4">
                <iframe 
                  src={`${selectedFile.path}#toolbar=1&navpanes=1`}
                  className="w-full h-full border-0 rounded shadow"
                  title={selectedFile.name}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <File size={48} className="mx-auto mb-4" />
              <p>Görüntülemek için bir PDF dosyası seçin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}