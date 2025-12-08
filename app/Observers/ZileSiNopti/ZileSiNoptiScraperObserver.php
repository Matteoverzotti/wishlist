<?php

namespace App\Observers\ZileSiNopti;

use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\UriInterface;
use Spatie\Crawler\CrawlObservers\CrawlObserver;
use Symfony\Component\DomCrawler\Crawler;

use function Termwind\render;

class ZileSiNoptiScraperObserver extends CrawlObserver
{
    private $content;

    public function __construct()
    {
        $this->content = null;
    }

    /*
     * Called when the crawler will crawl the url.
     */
    public function willCrawl(UriInterface $url, ?string $linkText): void
    {
        Log::info('willCrawl', ['url' => $url]);
    }

    /*
     * Called when the crawler has crawled the given url successfully.
     */
    public function crawled(
        UriInterface $url,
        ResponseInterface $response,
        ?UriInterface $foundOnUrl = null,
        ?string $linkText = null,
    ): void {
        Log::info("Crawled: {$url}");
        $crawler = new Crawler((string) $response->getBody());
        // Save the html to a file

        $events = $crawler->filter('.kzn-sw.kzn-swa.kzn-lista-evenimente');
        $events->each(function (Crawler $node) {
            Log::info("Event found: " . $node->html());
        });
        // Log::info("Found " . $events->html());
    }

    /*
     * Called when the crawler had a problem crawling the given url.
     */
    public function crawlFailed(
        UriInterface $url,
        RequestException $requestException,
        ?UriInterface $foundOnUrl = null,
        ?string $linkText = null,
    ): void {
        Log::error("Failed: {$url}");
    }

    /*
     * Called when the crawl has ended.
     */
    public function finishedCrawling(): void
    {
        Log::info("Finished crawling");
    }
}
