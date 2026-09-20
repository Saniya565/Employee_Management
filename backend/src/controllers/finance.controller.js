import FinanceHead from "../models/FinanceHead.js";
import Transaction from "../models/Transaction.js";

export async function listHeads(req,res){
  const { type } = req.query;
  res.json(await FinanceHead.find(type ? { type } : {}).sort({ isDefault:-1, name:1 }));
}
export async function createHead(req,res){
  const { name, type } = req.body;
  if(!name || !type) return res.status(400).json({message:"Name and type are required"});
  res.status(201).json(await FinanceHead.create({name,type,isDefault:false}));
}
export async function listTransactions(req,res){
  const {type, from, to, head} = req.query;
  const q={};
  if(type) q.type=type;
  if(head) q.head=head;
  if(from || to){ q.date={}; if(from) q.date.$gte=new Date(from); if(to){const d=new Date(to); d.setHours(23,59,59,999); q.date.$lte=d;} }
  res.json(await Transaction.find(q).populate("head","name type").sort({date:-1,createdAt:-1}));
}
export async function createTransaction(req,res){
  const {date,amount,type,head,description,remarks}=req.body;
  if(!date || amount===undefined || !type || !head) return res.status(400).json({message:"Date, amount, type and head are required"});
  const h=await FinanceHead.findOne({_id:head,type});
  if(!h) return res.status(400).json({message:"Invalid head for transaction type"});
  res.status(201).json(await Transaction.create({date,amount,type,head,description,remarks,createdBy:req.user._id}));
}
export async function updateTransaction(req,res){
  const item=await Transaction.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}).populate("head","name type");
  if(!item) return res.status(404).json({message:"Transaction not found"});
  res.json(item);
}
export async function deleteTransaction(req,res){
  const item=await Transaction.findByIdAndDelete(req.params.id);
  if(!item) return res.status(404).json({message:"Transaction not found"});
  res.json({message:"Transaction deleted"});
}
export async function financeSummary(req,res){
  const [income,expenditure]=await Promise.all([
    Transaction.aggregate([{$match:{type:"Income"}},{$group:{_id:null,total:{$sum:"$amount"}}}]),
    Transaction.aggregate([{$match:{type:"Expenditure"}},{$group:{_id:null,total:{$sum:"$amount"}}}])
  ]);
  const i=income[0]?.total||0,e=expenditure[0]?.total||0;
  res.json({income:i,expenditure:e,balance:i-e});
}
