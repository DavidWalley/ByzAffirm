# ByzAgree
NOT Hashgraph (nor Blockchain) - Towards an Open Asynchronous Byzantine Fault Tolerant Consensus Algorithm

Blockchain - the basic algorithm that BitCoin and related cryptocurrencies use, has a new challenger named Hashgraph. A coin, Hedera Hashgraph, has been announced by the Hedera governance council. While provably superior on many fronts to any blockchain variant including Etherium, many are rejecting Hashgraph because of the patents claimed by Swirlds and inventor Leemon Baird.


**IMPORTANT: I am not a lawyer and this code repository does not contain any valid legal advice. Any and all code to be added is meant for discussion of my thoughts and experiments only. As a non-lawyer, I cannot say if any or all of the code violates one or several patents, so do not execute, copy, use or incorporate any of this code in any project for any purpose whatsoever.**

**One goal of this repo is to ask whether an alternative to Hashgraph would be subject to their patents or not. Therefore, I hereby put any original work or ideas of mine in this repo under the MIT license, but if you use anything covered by the Hashgraph patents, which I cannot advise you on, then obviously you have to contact Swirlds, the owner, to avoid infringement.**


I understand Baird's actions - he has put considerable time, energy and genius into this work, and would like to make some money in return. He has had a flood of requests for a cyptocurrency, and is responding through his company, Swirlds, and its perpetual membership on the governance council. Hedera members will jointly run a Hashgraph-based network and coin, and will not allow a fork. All of this sounds good, but another way of saying it is - if they decide you are competing with their coin in any way they can enforce their patents and may shut you down.

I don't want to get into the freedom/establishment/anarchy/bubble debate, because I don't begrudge Baird's efforts to make a buck. I congratulate him and thank him. I just wish there was an open source, provably 100% resolving Async BFT that I could use for my non-coin project.

You may or may not want to create a coin. Maybe you want to create a game, or a fair on-line auction, or a notary service, or maybe you have a totally unique idea you aren't ready to talk about yet. You might be like me and would prefer not having to worry about some future risk of you or one of your users crossing some legal line. Whatever my reason for wanting open source, I wish Baird well, but have to fork from his path at this point.

I have two Questions and a Goal:

(1) Are Baird's patents valid given his statements about Hashgraph? 

(2) Is it possible to implement Async BFT some other way, without violating his patents?

(3) Write a working implementation of some other scheme using public information and obvious decisions only.

I am not a lawyer, but am considering starting a crowd-funding project to get a lawyer's opinion. I would like to lay-out some preliminary info which might be useful.

If you have ideas or code you would like to contribute, I can be contacted at dave at davidwalley.ca, but please keep in mind that I will use public domain and obvious ideas only, and I want to avoid being "poisoned" by any ideas that might infringe any patent or copyright claims of Hashgraph or anyone else.

# Hashgraph's Foundations

According to Baird, Hashgraph is based on: DAGs - directed acyclic graphs (the "graph" part of Hashgraph); the gossip communications scheme; Byzantine voting algorithms; and, super-efficient "gossip-about-gossip" that uses a "hash", and virtual voting.  Undoubtedly, there are many other details, but considering each:
- DAG is a well-known mathematical abstraction studied by others working on Bitcoin-related solutions, and allows visualization of the order of communications in a computer network. It does not affect a network in any way -  it merely describes what is already happening.
- The idea behind the gossip communications scheme can be summed up as "tell two friends, and they tell two friends, and so on, and so on".  This is a catchphrase of an old television commercial, and is well-known in computer networking.
- According to Baird, Byzantine voting algorithms are fully described in several 30 year-old patents.
- Gossip-about-gossip is a radically efficient simplification which required genius insight, but is not necessary. According to Baird, his insight allows a history of communications (the DAG) to be reconstructed, which is an important result, while only requiring a very small additional overhead.
- Hashing is a standard process used in programming.
- Virtual Voting may be a key idea, but I think it is well understood, especially in political circles.

I am certain that the information contained in a DAG can be communicated in some other, perhaps inefficient, way. Any other way would certainly be less brilliant, but does it matter? Hashgraph claims hundreds of transactions in a hundredth of a second.  Suppose it took 2 hundredths of a second - would anyone care? Perhaps industrial-scale use would require two computers to do what Hashgraph can do with one - does that matter in the context of a multi-million dollar opportunity?

Writing any software is hard and details take time and effort, but I think it is possible to write a replacement for Hashgraph with no reference to the gossip-about-gossip idea, and everything else appears to this non-lawyer to be in the public domain.

A rewrite should not be anywhere near as difficult as the task that originally faced Baird. For one thing, we know that at least one solution is possible. Where he looked when no working solution was known to exist, we look for a second.

He started with the admirable idea of mathematically proving the validity of every step. We don't need to prove anything - yet. We can test our solution (but not prove it) at every step.  If sufficient testing shows that a new solution gives the same results as Hashgraph, then it would definitely be worth proving it mathematically.

# First Stab at Another Obvious Scheme
- Look for network communications scheme giving consensus time to a message and its payload.
- Each node keeps a time-ordered log of messages, and a copy of as much of every other node's log as known.
- Messages are encrypted and signed (using any desired public/private key encryption algorithm) so that once created they cannot be altered or forged, and can be passed along without alteration.
- Messages are passed around using a gossip protocol.
- Log and time-stamp messages that have information that might be useful for reaching consensus using a patent-expired Byzantine Fault Tolerant scheme.
- Compress logs by never duplicating information when a reference to info in some other log entry will do.

As my first task, I want to write a simple demo of the above. I won't be implementing a working version yet, just something to help visualize and verify how the scheme will work.


