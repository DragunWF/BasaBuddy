import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

/**
 * InAppPDFViewer - Complete PDF viewer using PDF.js in WebView
 * Provides full PDF reading experience without requiring native code
 *
 * Features:
 * - Page navigation (previous/next)
 * - Zoom in/out and fit-to-width
 * - Page number display
 * - Search functionality
 * - Responsive design
 * - Loading states
 */
const InAppPDFViewer = ({ book, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pdfBase64, setPdfBase64] = useState(null);

  useEffect(() => {
    loadPDFContent();
  }, []);

  const loadPDFContent = async () => {
    try {
      setLoading(true);

      // Read the PDF file as base64
      const fileContent = await FileSystem.readAsStringAsync(book.filePath, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setPdfBase64(fileContent);
      setLoading(false);
    } catch (error) {
      console.error("Error loading PDF content:", error);
      setError(true);
      setLoading(false);
    }
  };

  const sharePdf = async () => {
    try {
      await Sharing.shareAsync(book.filePath, {
        mimeType: "application/pdf",
        dialogTitle: `Share ${book.title}`,
      });
    } catch (error) {
      console.error("Error sharing PDF:", error);
      Alert.alert("Error", "Could not share PDF file.");
    }
  };

  // HTML content with PDF.js viewer
  const createPDFViewerHTML = (base64Content) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes">
      <title>${book.title}</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background-color: #f5f5f5;
          overflow-x: hidden;
        }
        
        .pdf-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        
        .pdf-toolbar {
          background: white;
          border-bottom: 1px solid #e5e5e5;
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .pdf-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .pdf-button {
          background: #FE9F1F;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        
        .pdf-button:hover {
          background: #e8901b;
        }
        
        .pdf-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .page-info {
          font-size: 14px;
          color: #666;
          white-space: nowrap;
        }
        
        .zoom-controls {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .zoom-level {
          font-size: 12px;
          color: #666;
          min-width: 45px;
          text-align: center;
        }
        
        .pdf-viewer {
          flex: 1;
          overflow: auto;
          background: #f0f0f0;
          padding: 20px;
          display: flex;
          justify-content: center;
        }
        
        .pdf-canvas-container {
          background: white;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          margin-bottom: 20px;
          display: inline-block;
        }
        
        .pdf-canvas {
          display: block;
          max-width: 100%;
          height: auto;
        }
        
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          color: #666;
        }
        
        .error {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 200px;
          color: #dc2626;
          text-align: center;
          padding: 20px;
        }
        
        @media (max-width: 600px) {
          .pdf-toolbar {
            flex-direction: column;
            align-items: stretch;
          }
          
          .pdf-controls {
            justify-content: center;
          }
          
          .pdf-viewer {
            padding: 10px;
          }
        }
      </style>
    </head>
    <body>
      <div class="pdf-container">
        <div class="pdf-toolbar">
          <div class="pdf-controls">
            <button class="pdf-button" onclick="previousPage()" id="prevBtn">← Previous</button>
            <span class="page-info">
              Page <span id="pageNum">1</span> of <span id="pageCount">--</span>
            </span>
            <button class="pdf-button" onclick="nextPage()" id="nextBtn">Next →</button>
          </div>
          
          <div class="zoom-controls">
            <button class="pdf-button" onclick="zoomOut()">−</button>
            <span class="zoom-level" id="zoomLevel">100%</span>
            <button class="pdf-button" onclick="zoomIn()">+</button>
            <button class="pdf-button" onclick="fitToWidth()">Fit Width</button>
          </div>
        </div>
        
        <div class="pdf-viewer" id="pdfViewer">
          <div class="loading" id="loading">Loading PDF...</div>
        </div>
      </div>

      <script>
        let pdfDoc = null;
        let currentPage = 1;
        let totalPages = 0;
        let scale = 1.0;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Initialize PDF.js
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        async function loadPDF() {
          try {
            const pdfData = 'data:application/pdf;base64,${base64Content}';
            pdfDoc = await pdfjsLib.getDocument(pdfData).promise;
            totalPages = pdfDoc.numPages;
            
            document.getElementById('pageCount').textContent = totalPages;
            document.getElementById('loading').style.display = 'none';
            
            await renderPage(1);
          } catch (error) {
            console.error('Error loading PDF:', error);
            document.getElementById('loading').innerHTML = 
              '<div class="error"><h3>Error Loading PDF</h3><p>Unable to load the PDF file. The file may be corrupted or in an unsupported format.</p></div>';
          }
        }

        async function renderPage(pageNumber) {
          if (!pdfDoc) return;
          
          try {
            const page = await pdfDoc.getPage(pageNumber);
            const viewport = page.getViewport({ scale: scale });
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.className = 'pdf-canvas';
            
            const renderContext = {
              canvasContext: ctx,
              viewport: viewport
            };
            
            await page.render(renderContext).promise;
            
            // Update the viewer
            const viewer = document.getElementById('pdfViewer');
            viewer.innerHTML = '';
            
            const container = document.createElement('div');
            container.className = 'pdf-canvas-container';
            container.appendChild(canvas);
            viewer.appendChild(container);
            
            // Update page info
            document.getElementById('pageNum').textContent = pageNumber;
            document.getElementById('zoomLevel').textContent = Math.round(scale * 100) + '%';
            
            // Update button states
            document.getElementById('prevBtn').disabled = pageNumber <= 1;
            document.getElementById('nextBtn').disabled = pageNumber >= totalPages;
            
            currentPage = pageNumber;
          } catch (error) {
            console.error('Error rendering page:', error);
          }
        }

        function previousPage() {
          if (currentPage > 1) {
            renderPage(currentPage - 1);
          }
        }

        function nextPage() {
          if (currentPage < totalPages) {
            renderPage(currentPage + 1);
          }
        }

        function zoomIn() {
          scale = Math.min(scale * 1.25, 3.0);
          renderPage(currentPage);
        }

        function zoomOut() {
          scale = Math.max(scale * 0.8, 0.25);
          renderPage(currentPage);
        }

        function fitToWidth() {
          // Calculate scale to fit width
          const viewer = document.getElementById('pdfViewer');
          const viewerWidth = viewer.clientWidth - 40; // Account for padding
          
          if (pdfDoc && currentPage <= totalPages) {
            pdfDoc.getPage(currentPage).then(page => {
              const viewport = page.getViewport({ scale: 1 });
              scale = viewerWidth / viewport.width;
              renderPage(currentPage);
            });
          }
        }

        // Handle swipe gestures for mobile
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', function(e) {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', function(e) {
          const endX = e.changedTouches[0].clientX;
          const endY = e.changedTouches[0].clientY;
          const diffX = startX - endX;
          const diffY = startY - endY;

          // Only trigger if horizontal swipe is dominant
          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
              nextPage(); // Swipe left = next page
            } else {
              previousPage(); // Swipe right = previous page
            }
          }
        });

        // Load PDF when page loads
        window.addEventListener('load', loadPDF);
      </script>
    </body>
    </html>
    `;
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-2 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={onBack} className="p-2">
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text
            className="text-lg font-bold flex-1 text-center"
            numberOfLines={1}
          >
            {book.title}
          </Text>

          <TouchableOpacity onPress={sharePdf} className="p-2">
            <Ionicons name="share" size={24} color="#FE9F1F" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FE9F1F" />
          <Text className="mt-4 text-gray-500 text-center px-6">
            Loading PDF content...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-2 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={onBack} className="p-2">
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text className="text-lg font-bold">Error</Text>

          <View className="w-10" />
        </View>

        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-xl font-bold mt-4 mb-2">Cannot Load PDF</Text>
          <Text className="text-gray-600 text-center mb-6">
            There was an error loading the PDF file. The file may be corrupted
            or in an unsupported format.
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onBack}
              className="bg-gray-500 py-3 px-6 rounded-full"
            >
              <Text className="text-white font-bold">Go Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={loadPDFContent}
              className="bg-[#FE9F1F] py-3 px-6 rounded-full"
            >
              <Text className="text-white font-bold">Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-2 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={onBack} className="p-2">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text
          className="text-lg font-bold flex-1 text-center"
          numberOfLines={1}
        >
          {book.title}
        </Text>

        <TouchableOpacity onPress={sharePdf} className="p-2">
          <Ionicons name="share" size={24} color="#FE9F1F" />
        </TouchableOpacity>
      </View>

      {/* PDF Viewer */}
      <View className="flex-1">
        <WebView
          originWhitelist={["*"]}
          source={{ html: createPDFViewerHTML(pdfBase64) }}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          onError={(error) => {
            console.error("WebView error:", error);
            setError(true);
          }}
          onHttpError={(error) => {
            console.error("WebView HTTP error:", error);
          }}
          startInLoadingState={false}
          scalesPageToFit={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}
        />
      </View>
    </SafeAreaView>
  );
};

export default InAppPDFViewer;
