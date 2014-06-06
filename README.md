# mbox
[![Build Status](http://browserman.dp:9000/api/app/mbox/badge)](http://search.cortexjs.org/package/mbox)

> The best project ever.

## Getting Started
Before anything taking its part, you should install [node](http://nodejs.org) and "cortex".

#### Install Node

Visit [http://nodejs.org](http://nodejs.org), download and install the proper version of nodejs.

#### Install Cortex

    # maybe you should use `sudo`
    npm install -g cortex

## Using mbox In Your Project

First, install 'mbox' directly with `ctx install` (recommended)
	
	ctx install mbox --save
	
or, you could update your package.json manually
    
    dependencies: {
        'mbox': '<version-you-want>'
    }
    
and install dependencies
	
	ctx install
    
Then, use `require` method in your module
    
    var mbox = require('mbox');
    
Finally, start cortex server
    
    ctx server
    
Then cortex will care all the rest.


## API Documentation

### mbox: constructor
': constructor' means the `module.exports` of module 'mbox' is a constructor that we should use it with the `new` keyword

	new mbox(options)
	
#### options
- options.name {String}



### mbox.\<method-name\>(arguments)
Means this is a static method of `module.exports`

#### arguments
// arguments description here

### .\<method-name\>(arguments)
Mean this is a method of the instance

#### arguments
// arguments description here