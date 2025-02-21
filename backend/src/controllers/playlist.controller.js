const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');
const https = require('https');

const execAsync = promisify(exec);
const binDir = path.join(__dirname, '../../../bin');
const ytdlpPath = path.join(binDir, 'yt-dlp.exe');
const ffmpegPath = path.join(binDir, 'ffmpeg.exe');
let downloadDir = path.join(__dirname, '../../downloads');

// Créer le dossier de téléchargement s'il n'existe pas
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

function convertMusicUrlToRegular(url) {
    return url.replace('music.youtube.com', 'www.youtube.com');
}

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {
                reject(err);
            });
        });
    });
}

async function downloadFFmpeg() {
    const ffmpegUrl = 'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip';
    const zipPath = path.join(binDir, 'ffmpeg.zip');
    
    try {
        // Télécharger FFmpeg
        console.log('Downloading FFmpeg...');
        await downloadFile(ffmpegUrl, zipPath);
        
        // Extraire FFmpeg en utilisant tar
        console.log('Extracting FFmpeg...');
        await execAsync(`cd "${binDir}" && tar -xf ffmpeg.zip`);
        
        // Déplacer les fichiers nécessaires
        const ffmpegDir = path.join(binDir, 'ffmpeg-master-latest-win64-gpl', 'bin');
        await execAsync(`cd "${binDir}" && move /Y "${ffmpegDir}\\ffmpeg.exe" ffmpeg.exe && move /Y "${ffmpegDir}\\ffprobe.exe" ffprobe.exe`);
        
        // Nettoyer
        fs.unlinkSync(zipPath);
        return true;
    } catch (error) {
        console.error('Error downloading FFmpeg:', error);
        return false;
    }
}

async function ensureFFmpeg() {
    if (fs.existsSync(ffmpegPath)) {
        return true;
    }
    return await downloadFFmpeg();
}

exports.setDownloadDirectory = async (req, res) => {
    try {
        const { directory } = req.body;
        if (!directory) {
            return res.status(400).json({ message: 'Directory path is required' });
        }

        // Vérifier si le chemin est absolu
        const newDir = path.isAbsolute(directory) ? directory : path.join(process.cwd(), directory);

        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(newDir)) {
            fs.mkdirSync(newDir, { recursive: true });
        }

        // Tester si le dossier est accessible en écriture
        try {
            const testFile = path.join(newDir, '.test');
            fs.writeFileSync(testFile, '');
            fs.unlinkSync(testFile);
        } catch (error) {
            return res.status(400).json({ 
                message: 'Directory is not writable',
                details: error.message
            });
        }

        downloadDir = newDir;
        res.json({ 
            message: 'Download directory updated successfully',
            directory: newDir
        });
    } catch (error) {
        console.error('Error setting download directory:', error);
        res.status(500).json({ 
            message: 'Error setting download directory',
            details: error.message
        });
    }
};

exports.getPlaylistInfo = async (req, res) => {
    try {
        let { url } = req.query;
        if (!url) {
            return res.status(400).json({ message: 'URL is required' });
        }

        // Convertir l'URL YouTube Music en URL YouTube classique
        url = convertMusicUrlToRegular(url);
        console.log('Fetching playlist from URL:', url);

        // Utiliser yt-dlp avec une configuration adaptée à Windows
        const command = [
            `"${ytdlpPath}"`,
            `"${url}"`,
            '--flat-playlist',
            '--no-warnings',
            '--ignore-errors',
            '--encoding utf8',
            '--print',
            '"%(title)s###%(id)s###%(duration)s"'
        ].join(' ');

        console.log('Executing command:', command);

        const { stdout } = await execAsync(command, { 
            encoding: 'utf8',
            env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
        });
        
        const videos = stdout.split('\n')
            .filter(line => line.trim())
            .map(line => {
                try {
                    // Nettoyer la ligne des guillemets potentiels
                    const cleanLine = line.replace(/^"|"$/g, '').trim();
                    const [title, id, duration] = cleanLine.split('###');
                    
                    if (!id) {
                        console.log('Invalid line:', cleanLine);
                        return null;
                    }

                    return {
                        url: `https://www.youtube.com/watch?v=${id}`,
                        title: title || 'Unknown Title',
                        thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
                        duration: duration || '0'
                    };
                } catch (e) {
                    console.error('Error parsing video info:', e, 'Line:', line);
                    return null;
                }
            })
            .filter(video => video !== null);

        if (!videos || videos.length === 0) {
            return res.status(404).json({ message: 'No videos found in playlist' });
        }

        res.json({ data: videos });
    } catch (error) {
        console.error('Error getting playlist info:', error);
        res.status(500).json({ 
            message: 'Error getting playlist information',
            details: error.message,
            command: error.cmd
        });
    }
};

exports.downloadSong = async (req, res) => {
    try {
        let { url } = req.body;
        if (!url) {
            return res.status(400).json({ message: 'URL is required' });
        }

        // Convertir l'URL YouTube Music en URL YouTube classique
        url = convertMusicUrlToRegular(url);
        console.log('Downloading from URL:', url);

        // Obtenir les informations de la vidéo
        const { stdout: videoInfoStr } = await execAsync(`"${ytdlpPath}" "${url}" --print "%(title)s"`);
        const title = videoInfoStr.trim().replace(/[^\w\s]/gi, '');
        const fileName = `${title}.mp3`;
        const filePath = path.join(downloadDir, fileName);

        // Télécharger directement en MP3 avec la meilleure qualité
        const downloadCommand = [
            `"${ytdlpPath}"`,
            `"${url}"`,
            '--extract-audio',
            '--audio-format mp3',
            '--audio-quality 0',
            '--embed-thumbnail',
            '--add-metadata',
            '--no-keep-video',
            '--no-playlist',
            `--output "${filePath}"`
        ].join(' ');

        await execAsync(downloadCommand);

        res.json({
            message: 'Download completed',
            fileName,
            title: title,
            directory: downloadDir
        });
    } catch (error) {
        console.error('Error in download:', error);
        res.status(500).json({ 
            message: 'Error processing the download',
            details: error.message
        });
    }
};