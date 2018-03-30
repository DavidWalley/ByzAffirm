# ByzAgree
NOT Hashgraph (nor Blockchain) - Towards and Open Asynchronous Byzantine Fault Tolerant Consensus Algorithm

**IMPORTANT: I am not a lawyer and this code repository does not contain any valid legal advice. Any and all code to be added is meant for discussion of my thoughts and experiments only. As a non-lawyer, I cannot say if any or all of the code violates one or several patents, so do not execute, copy, use or incorporate any of this code in any project for any purpose whatsoever.

**One goal of this repo is to ask whether an alternative to Hashgraph would be subject to their patents or not. Therefore, I hereby put any original work or ideas of mine in this repo under the MIT license, but if you use anything covered by the Hashgraph patents, which I cannot advise you on, then obviously you have to contact Swirlds, the owner, to avoid infringement.


Blockchain - the basic algorithm that BitCoin and related cryptocurrencies use, has a new challenger named Hashgraph. A coin, Hedera Hashgraph, has been announced by the Hedera governance council. While provably superior on many fronts to any blockchain variant including Etherium, many are rejecting Hashgraph because of the patents claimed by Swirlds and inventor Leemon Baird.

I understand Baird's actions - he has put considerable time, energy and genius into this work, and would like to make some money. He has had a flood of requests for a cyptocurrency, and is responding through his company, Swirlds, and its perpetual membership on the governance council. Hedera members will jointly run a Hashgraph-based network and coin, and will not allow a fork. All of this sounds good, but another way of saying it is - if they decide you are competing with their coin in any way they can enforce their patents and may shut you down.

I don't want to get into the freedom/establishment/anarchy/bubble debate, because I don't begrudge Baird's efforts to make a buck. I congratulate him and thank him. I just wish there was an open source, provably 100% resolving Async BFT that I could use for my non-coin project.

You may or may not want to create a coin. Maybe you want to create a game, or a fair on-line auction, or a notary service, or maybe you have a totally unique idea you aren't ready to talk about yet. You might be like me and would prefer not having to worry about some future risk of you or one of your users crossing some legal line. Whatever the reason for wanting open source, I wish Baird well but have to fork from his path at this point.


I have two Questions and a Goal:
(1) Are Baird's patents valid given his statements about Hashgraph? 
(2) Is it possible to implement Async BFT some other way, without violating his patents?
(3) Write a working implementation of some other scheme using public information and obvious decisions only.

I am not a lawyer, but am considering starting a crowd-funding project to get a lawyer's opinion. I would like to lay-out some preliminary info which might be useful.

*Hashgraph's Foundations

According to Baird, Hashgraph is based on: DAGs - directed acyclic graphs (the "graph" part of Hashgraph); the gossip communications scheme; Byzantine voting algorithms; and, super-efficient "gossip-about-gossip" that uses a "hash", and virtual voting.  Undoubtedly, there are many other details, but considering each:
- DAG is a well-known mathematical abstraction studied by others working on Bitcoin-related solutions, and allows visualization of the order of communications in a computer network. It does not affect a network in any way -  it merely describes what is already happening.
- The idea behind the gossip communications scheme can be summed up as "tell two friends, and they tell two friends, and so on, and so on".  This is a catchphrase of an old television commercial, and is well-known in computer networking.
- According to Baird, Byzantine voting algorithms are fully described in several 30 year-old patents.
- Gossip-about-gossip is a radically efficient simplification which required genius insight, but is not necessary. According to Baird, his insight allows a history of communications (the DAG) to be reconstructed, which is an important result, while only requiring a very small additional overhead.
- Hashing is a standard process using in programming.
- Virtual Voting may be a key idea, but I think it is well understood, especially in political circles.

I am certain that a DAG can be communicated in some other inefficient way.  Any other way would certainly be less brilliant, but does it matter?  Baird claims he can achieve hundreds of transactions in a hundredth of a second.  Suppose it took 2 hundredths of a second - would anyone care? Perhaps industrial-scale use would require two computers to do what Baird can do with one - does that matter in the context of a multi-million dollar opportunity?

Writing any software is hard and details take time and effort, but I think it is possible to write a replacement for Hashgraph with no use of the gossip-about-gossip idea.
A rewrite should not be anywhere near as difficult as the task that originally faced Baird.  He started with the admirable idea of mathematically proving the validity of every step.  We don't need to prove anything - yet.  We have a working example of a solution (Hashgraph), and we merely need to duplicate its end functionality.  We can test our solution (but not prove it) at every step.  If sufficient testing shows that a new solution gives the same results as Hashgraph, then it would definitely be worth proving it mathematically.
