# ByzAffirm
NOT Hashgraph (nor Blockchain) - Towards an Open Asynchronous Byzantine Fault Tolerant Consensus Algorithm

tldr: A non-lawyer suggests Hashgraph patents may not be valid, and is doing preliminary tests on a working open alternative.

**NOTE: There is only test code here, so far.**

Blockchain - the basic algorithm that BitCoin and related cryptocurrencies use, has a new challenger named Hashgraph. A coin, Hedera Hashgraph, has been announced by the Hedera governance council. With superior performance over any blockchain variant including Etherium, many are rejecting Hashgraph because of the patents claimed by Swirlds and inventor Leemon Baird.

**IMPORTANT: I am not a lawyer and this code repository does not contain any valid legal advice. Any and all code to be added is meant for discussion of my thoughts and experiments only. As a non-lawyer, I cannot say if any or all of the code violates one or several patents, so do not execute, copy, use or incorporate any of this code in any project for any purpose whatsoever.**

**I hereby put any original work or ideas of mine in this repo under the MIT license. One goal of this repo is to ask whether an alternative to Hashgraph would be subject to patent restrictions or not, so if you use anything here that is covered by the Hashgraph patents, which I cannot advise you on, then you must contact the owners to avoid infringement.**

I understand Baird's actions - he has put considerable time, energy and genius into this work. He has had a flood of inquiries about a cyptocurrency, and is responding with Hedera. Hedera members will jointly govern and run a Hashgraph-based network and coin, and have promised not to allow a fork. All of this sounds good, but another way of saying it is - if they decide you are competing with their coin in any way they can enforce their patents and may shut you down.

I don't want to get into the freedom/establishment/anarchy/bubble debates, because I don't begrudge Baird's desire to make a buck. I congratulate him and thank him. I just wish there was an open source, provably 100% resolving Async BFT that I could use for my non-coin project.

You may be like me. You may or may not want to create a coin. Maybe you want to create a game, or an on-line auction, or a notary service, or maybe you have a novel idea you cannot talk about yet. Maybe you prefer not having the worry of crossing some future legal line as your project grows. But in any case, if you are like me and prefer open source, let us wish Baird well and divert from his path.

## Two Questions and a Goal:
(1) Are Baird's patents valid given his statements about Hashgraph's underlying ideas?

(2) Is it possible to implement Async BFT some other way, without violating his patents?

(3) The Goal - Write a working implementation of some other Async BFT scheme using public information and obvious decisions only, so it can work around any patents.

I am not a lawyer, but am considering starting a crowd-funding project to get a lawyer's opinion if this project reaches its software goals. I would like to lay-out some preliminary info which might be useful.

If you have ideas or code you would like to contribute, I can be contacted at dave at davidwalley.ca, but please keep in mind that I will use public domain and obvious ideas only, as I want to avoid being "poisoned" by any patented ideas from Hashgraph or anywhere else.

## Hashgraph's Foundations
According to Baird, Hashgraph is based on: Directed Acyclic Graphs (DAGs, the "graph" part of Hashgraph); gossip communications; Byzantine voting algorithms; super-efficient "gossip-about-gossip" that uses a "hash"; and, virtual voting. Undoubtedly, there are many other details, but considering each:
- DAG is a well-known mathematical abstraction studied by others working on Bitcoin-related solutions, and allows visualization of the order of communications in a computer network. It does not affect a network in any way - it merely describes what is already happening.
- The idea behind the gossip communications scheme can be summed up as "tell two friends, and they tell two friends, and so on, and so on". This is a catchphrase of an old television commercial, and is well-known in computer networking.
- According to Baird, Byzantine voting algorithms are fully described in several 30 year-old patents.
- Gossip-about-gossip is a radically efficient simplification which required Baird's genius insight, but I think it may not be necessary. According to Baird, his insight allows a history of communications (the DAG) to be reconstructed, which is an important result, while only requiring a very small additional overhead. This is the idea I am most eager to avoid.
- Hashing is a standard process used in programming.
- Virtual voting may be a key idea, but is well understood, especially in political circles. For example, the Ontario Progressive Conservative Party recently elected a new leader on the third round of "preferential voting" conducted by automated algorithm after the first round's simple count did not give a clear winner. (There was a lot of delay and chaos due to human interference, but the algorithm's result was eventually accepted.) As far as I can tell, the algorithm is but one example of "virtual voting". Non-automated virtual voting may be traced as far back as Condorcet in 1793 (research needed here).

I am certain that the information contained in a DAG can be communicated in some other, perhaps inefficient, way. Any other way would certainly be less brilliant, but does it matter? Hashgraph claims hundreds of transactions in a hundredth of a second. Suppose it took 2 hundredths of a second - would anyone care? Perhaps industrial-scale use would require two computers to do what Hashgraph can do with one - does that matter in the context of a multi-million dollar opportunity?

Writing any software is hard and details take time and effort, but I think it is possible to write a replacement for Hashgraph with no reference to the gossip-about-gossip idea, and everything else appears to this non-lawyer to be obvious or in the public domain.

A rewrite should not be anywhere near as difficult as the task that originally faced Baird. For one thing, he started without knowing whether a practical working solution was even possible, while we start with a working example and look for a second. The legal issues may be more difficult than the programming issues.

Baird started with the admirable idea of mathematically proving the validity of every step. We don't need to prove anything - yet. We can test our solution (but not prove it) at every step. If sufficient testing shows that a new solution gives the same results as Hashgraph, then it would definitely be worth proving it mathematically some day.

## First Stab at Some Other Obvious Scheme
I think the following are reasonably obvious to a programmer skilled in the art:
- Our goal is that all nodes on a network eventually settle on a consensus of when all data-payload containing messages first appeared (and most importantly, the consensus order of messages).
- Each node keeps a time-ordered and time-stamped log of all received messages that might logically contain information useful in our goal, i.e., data-payloads and times of reception.
- Log entries are encrypted and signed immediately (using any good public/private key cryptographic protocol), so they can be passed along further without alteration or fear of alteration or forgery.
- Messages are passed around using gossip protocol.
- To avoid redundant communications, each node actively maintains a copy of as much of every other node's log as possible.
- Compress logs by not duplicating information when a reference to another log entry will do.
- Compress logs by not storing information that can be shown to have no further influence on reaching our goal.
- When queried, a node replies with the data-payload, the best estimate of when the message became well-known, and whether enough information is on-hand to finalize the ordering of the message or not, using Byzantine Fault Tolerant algorithms described in expired patents only.

I think the above may be enough to achieve the goal, but I need to write some code now.

As my first task, I want to write a simple demo of the above and see if it works and/or what needs modification. I won't be implementing a full, working version yet, just something to help visualize and test how the scheme will work.

## Progress
- Ability to set up node.js test nodes on localhost, using sequential ports 8080, 8081.... While not required for testing, this architecture is closer to what the final version will be like.
- RSA cryptology for private-key encryption and public-key decryption is working. In future, this could be replaced with any private/public cryptographic scheme.
- Gossip communications protocol is working.
- Started work on a different tack - compare messages head-to-head, with less reliance in timestamp.

## Bugs and TODOs
- localhost testing fails when not connected to Internet, even though it should not be needed.
- TODO: Test, test, test.
- TODO: Write tests with misbehaving nodes, and run for extended times.
- TODO: Set up a test copy of the real Hashgraph algorithm for comparison.

## Next Steps
- Compare messages head-to-head in each node's copy of logs.
- Assuming honest nodes have reasonable accuracy of their clocks, put a time-limit (starting from creation timestamp) for getting enough data for a given node to determine its opinion on which of two memos is first.

Note: I know that reading more about Hashgraph probably gives an answer to the above, but I am avoiding doing this. Reading the 30 year-old patents may also give the answer, which would be fine, so I will do this when I run out of obvious things to try.

## How You Can Help
- Spread the word. No rush though - Baird's group is spending millions of dollars promoting Hashgraph over Blockchain, which is not a bad thing for ByzAffirm.
- Research into the history of virtual voting systems might be useful.
- Not ready yet, but raising or preparing to raise money for legal opinions could be useful.

## Other Projects
My objective is a free and open source Async BFT, so if someone else beats me to it, that is fine by me. I am starting a list of other projects that may or may not fit the bill:
- https://medium.com/algorand/algorands-instant-consensus-protocol-e66ac5807e37
