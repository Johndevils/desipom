import axios from 'axios'
import cheerio from 'cheerio'

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/112.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/14.0.3 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 Version/14.0 Mobile/15A372 Safari/604.1',
  'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 Chrome/113.0.0.0 Safari/537.36'
];

export default async function handler(req, res) {
  const {
    query: { page = 1, search = 'desi' }
  } = req;

  const url = `https://www.xnxx.com/search/${search}/${page}`;
  const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': userAgent
      }
    });

    const $ = cheerio.load(data);
    const results = [];

    $('.thumb-block').each((_, el) => {
      const title = $(el).find('.title a').text().trim();
      const link = 'https://www.xnxx.com' + $(el).find('.title a').attr('href');
      const thumbnail = $(el).find('img').attr('data-src');
      const duration = $(el).find('.duration').text().trim();

      if (title && link && thumbnail) {
        results.push({ title, link, thumbnail, duration });
      }
    });

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
