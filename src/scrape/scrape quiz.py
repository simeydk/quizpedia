#!/usr/bin/env python
# coding: utf-8

# In[14]:


from bs4 import BeautifulSoup
import requests
import json
from urllib.parse import urlparse
import os


# In[4]:


def get_links_from_box(box, url_base = ''):
    if url_base:
        if url_base[-1] != '/':
            url_base = url_base + '/'
    a_tags = box.select('li a')
    if len(a_tags) < 2: return
    return {
        'title': a_tags[0].text,
        'q_url': url_base + a_tags[0].get('href'),
        'a_url': url_base + a_tags[1].get('href'),
        'a_title': a_tags[1].text,
    }


# In[5]:


def get_links_from_theme_page_url(url):
    parsed = urlparse(url) # get parsed object
    url_base = parsed.scheme + '://' + parsed.netloc + '/' # get base url
    text = requests.get(url).text # get the full html text of the source page
    soup = BeautifulSoup(text) # convert html text into BeautifulSoup 
    boxes = soup.select('.box-01') # get all the elements with a '.box-01' class
    links = [get_links_from_box(box, url_base) for box in boxes] # get all the links
    links = [link for link in links if link] # Remove blanks
    return links


# In[6]:


def get_text_list_for_selector_on_page(url, selector = 'ol li'):
    text = requests.get(url).text
    soup = BeautifulSoup(text)
    elements = soup.select(selector)
    texts = [el.text for el in elements]
    return texts


# In[7]:


def add_q_and_a_list_to_links(link_obj):
    q_list = get_text_list_for_selector_on_page(link_obj['q_url'])
    a_list = get_text_list_for_selector_on_page(link_obj['a_url'])
 
    return {
        ** link_obj,
        'q_list': q_list,
        'a_list': a_list
    }


# In[8]:


def get_lists_from_theme_url(url):
    links = get_links_from_theme_page_url(url)
    lists = [add_q_and_a_list_to_links(link) for link in links]
    return lists


# In[12]:


def dict_to_json_file(the_dict, json_file):
    with open(json_file, 'w') as f:
        json.dump(the_dict, f)


# In[16]:


pub_base = 'https://www.challengethebrain.com/questions-and-answers-pub-quiz.htm'
trivia_base = 'https://www.challengethebrain.com/questions-and-answers-trivia-quiz.htm'
general_base = 'https://www.challengethebrain.com/questions-and-answers-general-knowledge-quiz.htm'

out_folder = 'D:/Simey/Quiz'

pub_file = 'quiz_pub.json'
trivia_file = 'quiz_trivia.json'
general_file = 'quiz_general.json'

pairs = [
    (pub_base, pub_file),
    (trivia_base, trivia_file),
    (general_base, general_file),
]

for url, file in pairs:
    out_file = os.path.join(out_folder,file)
    print(out_file)
    print(url)
    lists = get_lists_from_theme_url(url)
    print('got lists from url')
    dict_to_json_file(lists, out_file)
    print(f'saved in {out_file}')

