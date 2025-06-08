import axios from 'axios'
import cheerio from 'cheerio'

export default async function handler(req, res) {
  const {
    query: { page = 1, search = 'desi' }
  } = req;

  const url = `https://www.xnxx.com/search/${search}/${page}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
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
