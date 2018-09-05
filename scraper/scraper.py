from queue import Queue
import threading
import requests
from bs4 import BeautifulSoup
import time
import random
import json

q = Queue()
targetQueue = Queue()
WORKERS = 10
MIN_WAIT = 1
MAX_WAIT = 3
ROOT_URL = "http://arteca.mit.edu"


def sleepy_request(_link):
    # waiting
    sleepy = random.randint(MIN_WAIT, MAX_WAIT)
    time.sleep(sleepy)
    print("waited " + str(sleepy) + " seconds")
    request = requests.get(_link)
    return BeautifulSoup(request.text, features="html.parser")


def map_link_to_abstracts(_link):
    if not _link.startswith("http"):
        _link = ROOT_URL + _link
    html = sleepy_request(_link)
    # return None if no abstract found
    try:
        abstract_titles = html.select(".body.field div.field-label")
        abstract = None
        for title in abstract_titles:
            if "Abstract" in title.string or "abstract" in title.string:
                abstract = title.next_sibling.string
        return abstract
    except:
        return None


def worker(_q, _tq, _i):
    print("starting worker " + str(_i))

    while True:
        item = _q.get()
        # if None end task
        if item is None:
            break
        print("got " + item)
        # waiting
        html = sleepy_request(item)
        print("getting abstracts")
        # abstract_links = [_link["href"] for _link in html.select("a.journal-abstract-link")]
        # abstract_texts = map(map_link_to_abstracts, abstract_links)
        titles = [_link for _link in html.select("div.journal-article-title p")]
        print(titles)
        for text in titles:
            _tq.put(text.string)
        _q.task_done()
    print("stopping " + str(_i))


# first request to root page
root_request = requests.get(ROOT_URL + "/journal/leonardo")
root_html = BeautifulSoup(root_request.text, features="html.parser")
link_list = root_html.select(".view-content ul li a")


for link in link_list:
    q.put(ROOT_URL + link["href"])

threads = []
for i in range(WORKERS):
    t = threading.Thread(target=worker, args=(q, targetQueue, i))
    t.start()
    threads.append(t)


# block until all tasks are done
q.join()

# stop workers
for i in range(WORKERS):
    q.put(None)
for t in threads:
    t.join()

# turn tq into list
result = list(targetQueue.queue)
print(len(result))
with open('raw_titles.json', 'w') as raw_file:
    json.dump(result, raw_file)




