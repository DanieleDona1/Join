const selectedInitials = [];

async function onloadAddtasks() {
  await isUserLoggedIn();
  await generateHeaderInitials();
  await createContactlistAddTask();
  loadDropDown();
  subtaskKeyDownAddSubtask();
  initTaskButtons();
  setClearButtonHandler();
  initCustomDropdowns();
  initFieldNavigation();
}

// Namen splitten
function splitName(fullName) {
  let p = fullName.split(' ');
  let f = p[0];
  let l = p.slice(1).join(' ');
  return { firstName: f, lastName: l };
}

// Kontaktliste erstellen
async function createContactlistAddTask() {
  let data = await loadData('contacts');
  let keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    let full = data[keys[i]].name;
    let { firstName, lastName } = splitName(full);
    contactList.push({id:keys[i],color:data[keys[i]].color,firstName,lastName});
  }
}

// Datum formatieren
function formatDate(input) {
  let val = cleanInput(input.value);
  let { day, month, year } = extractDateParts(val);
  ({ day, month } = validateDate(day, month));
  input.value = formatOutput(day, month, year);
}

function cleanInput(value) { return value.replace(/\D/g,''); }

function extractDateParts(value) {
  return {
    day: value.substring(0,2),
    month: value.substring(2,4),
    year: value.substring(4,8)
  };
}

function validateDate(day, month) {
  if(day>31) day='31';
  if(month>12) month='12';
  return { day, month };
}

function formatOutput(d,m,y) {
  let out=d;
  if(m) out+='/'+m;
  if(y) out+='/'+y;
  return out;
}

// Dropdown laden
function loadDropDown() {
  const dd = document.getElementById('drop-down-1');
  const items = dd.querySelector('.select-items');
  const disp = document.getElementById('initials-display');
  createContactOptions(items);
  handleDropdownOptions(disp);
}

function createContactOptions(items) {
  for (let i=0;i<contactList.length;i++){
    let c=contactList[i],inits=getInitials(c);
    items.innerHTML+=getOptionTemplate(c,inits);
  }
}

function getInitials(c) {
  return c.firstName.charAt(0).toUpperCase()+c.lastName.charAt(0).toUpperCase();
}

function getOptionTemplate(c,inits) {
  return `
    <div class="select-option" data-value="${c.firstName} ${c.lastName}" id="option-${c.firstName}-${c.lastName}">
      <div class="contact">
        <div class="initial" style="background-color:${c.color};">${inits}</div>
        <div class="name">${c.firstName} ${c.lastName}</div>
      </div>
      <input type="checkbox"/>
      <div class="custom-checkbox"></div>
    </div>
  `;
}

function handleDropdownOptions(disp) {
  const opts=document.querySelectorAll('.select-option');
  for(let i=0;i<opts.length;i++){
    opts[i].addEventListener('click',()=>{
      toggleOptionSelection(opts[i]);
      updateInitialsDisplay(disp);
    });
  }
}

function isDropDown2(option) {
  const p=option.closest('.add-task-custom-select');
  return p&&p.id==='drop-down-2';
}

function toggleOptionSelection(option) {
  if(isDropDown2(option)) return;
  const { initials, checked } = toggleCheckboxAndClasses(option);
  updateSelectedInitials(initials,checked);
}

function toggleCheckboxAndClasses(opt) {
  const box=opt.querySelector('input[type="checkbox"]');
  const c=opt.querySelector('.custom-checkbox');
  const inits=opt.querySelector('.initial').textContent;
  box.checked=!box.checked;
  opt.classList.toggle('active');
  c.classList.toggle('checked');
  return { initials:inits, checked:box.checked };
}

function updateSelectedInitials(inits,check) {
  if(check){
    if(selectedInitials.indexOf(inits)===-1) selectedInitials.push(inits);
  } else {
    let idx=selectedInitials.indexOf(inits);
    if(idx>-1) selectedInitials.splice(idx,1);
  }
}

function updateInitialsDisplay(disp) {
  disp.innerHTML='';
  for(let i=0;i<selectedInitials.length;i++){
    let contactForInit=findContactByInitial(selectedInitials[i]);
    if(contactForInit) disp.innerHTML+=createInitialElement(contactForInit);
  }
}

function findContactByInitial(initial) {
  for(let i=0;i<contactList.length;i++){
    if(getInitials(contactList[i])===initial)return contactList[i];
  }
  return null;
}

function createInitialElement(c) {
  return `<div class="initial" style="background-color:${c.color};margin-right:10px;">${getInitials(c)}</div>`;
}

// Task Buttons
function initTaskButtons() {
  const btns=document.querySelectorAll('.task-button');
  for(let i=0;i<btns.length;i++){
    btns[i].addEventListener('click',()=>{
      deactivateAllButtons(btns);
      btns[i].classList.add('active');
      updateButtonIcons(btns);
    });
  }
  updateButtonIcons(btns);
}

function deactivateAllButtons(btns) {
  for(let i=0;i<btns.length;i++) btns[i].classList.remove('active');
}

function updateButtonIcons(btns) {
  for(let i=0;i<btns.length;i++){
    let b=btns[i], c=b.getAttribute('data-color');
    let img=b.querySelector('img');
    let t=b.classList.contains('active')?'active':'inactive';
    img.src=`/assets/icons/add_tasks/${t}_icon_${c}.svg`;
  }
}

// Checkboxes ermitteln
function activeCheckboxesRemote() {
  const checked=document.querySelectorAll(".select-option input[type='checkbox']:checked");
  for(let i=0;i<checked.length;i++){
    const p=checked[i].closest('.select-option');
    const n=p.querySelector('.name').textContent;
    for(let j=0;j<contactList.length;j++){
      if(`${contactList[j].firstName} ${contactList[j].lastName}`===n){
        selectedContacts.push(contactList[j].id);break;
      }
    }
  }
}

// Next Field on Enter
function moveToNextField(e) {
  if (e.key === 'Enter') {
    e.preventDefault(); // Verhindert das Standardverhalten (Formular abschicken)
    const fields = Array.from(document.querySelectorAll('[id^="input-field-"]'));
    const currentIndex = fields.indexOf(e.target); // Aktuelles Feld finden
    const nextField = fields[currentIndex + 1] || document.getElementById('subtaskInput');
    if (nextField) nextField.focus(); // Fokus auf das nächste Feld setzen
  }
}

function preventFormSubmit() {
  const form = document.querySelector('form'); // Selektiere das Formular
  if (form) {
    form.addEventListener('submit', (e) => e.preventDefault()); // Verhindere Formular-Submit
  }
}

function initFieldNavigation() {
  // Event-Listener für Eingabefelder
  const inputFields = document.querySelectorAll('[id^="input-field-"]');
  for (let i = 0; i < inputFields.length; i++) {
    inputFields[i].addEventListener('keydown', moveToNextField);
  }

  // Event-Listener für das Formular
  preventFormSubmit();
}

// Input Feld Keydown
function subtaskKeyDownAddSubtask() {
  const inp=document.getElementById('subtaskInput');
  if(inp){
    inp.addEventListener('keydown',(e)=>{
      if(e.key==='Enter'){
        if(e.target.value.trim()===''){e.preventDefault();}
        else{addCurrentSubtask();e.preventDefault();}
      }
    });
  }
}

// Reset Form
function resetForm() {
  const f=document.getElementById('form-add-task');
  if(f) f.reset();
}

function resetPriorityButtons() {
  const btns=document.querySelectorAll('.task-button');
  for(let i=0;i<btns.length;i++){
    btns[i].classList.remove('active');
    const img=btns[i].querySelector('img');
    const c=btns[i].getAttribute('data-color');
    img.src=`/assets/icons/add_tasks/inactive_icon_${c}.svg`;
  }
}

function setDefaultPriority() {
  const mb=document.querySelector('[data-color="medium"]');
  if(mb){
    mb.classList.add('active');
    const img=mb.querySelector('img');
    img.src=`/assets/icons/add_tasks/active_icon_medium.svg`;
  }
}

function clearSubtasks() { removeAddedSubtask('all'); }

function hideAllErrorMessages() {
  const errs=document.querySelectorAll('.error-msg-addtask');
  for(let i=0;i<errs.length;i++) errs[i].classList.add('d-none');
}

function resetCategoryDropdown() {
  const d2=document.getElementById('drop-down-2');
  if(!d2)return;
  const s=d2.querySelector('.select-selected');
  if(s) s.textContent='Select task category';
  currentTaskCategory='';
}

function resetCategoryOptions() {
  const d2=document.getElementById('drop-down-2');
  if(!d2)return;
  const opts=d2.querySelectorAll('.select-option');
  for(let i=0;i<opts.length;i++) opts[i].classList.remove('active');
}

function clearSelectedContacts() {
  selectedInitials.length=0;
  selectedContacts.length=0;
}

function clearInitialsDisplay() {
  const d=document.getElementById('initials-display');
  if(d)d.innerHTML='';
}

function uncheckAllContactOptions(dd) {
  const opts=dd.querySelectorAll('.select-option');
  for(let i=0;i<opts.length;i++){
    const box=opts[i].querySelector('input[type="checkbox"]');
    const c=opts[i].querySelector('.custom-checkbox');
    if(box.checked)box.checked=false;
    opts[i].classList.remove('active');
    c.classList.remove('checked');
  }
}

function resetContactsDropdown() {
  const d1=document.getElementById('drop-down-1');
  if(!d1)return;
  const sel=d1.querySelector('.select-selected');
  if(sel) sel.textContent='Select contacts to assign';
  clearSelectedContacts();
  clearInitialsDisplay();
  uncheckAllContactOptions(d1);
}

function clearAll() {
  resetForm();
  resetPriorityButtons();
  setDefaultPriority();
  clearSubtasks();
  hideAllErrorMessages();
  resetCategoryDropdown();
  resetCategoryOptions();
  resetContactsDropdown();
}

function setClearButtonHandler() {
  const c=document.getElementById('clear-button');
  if(c) c.addEventListener('click',clearAll);
}

// Create Task
async function createAddTask(cat) {
  if(checkRequiredFields()){
    activeCheckboxesRemote();
    formateDueDate();
    const d=getUserAddTaskData(cat);
    await addTask(d);
    redirectToPage('board.html');
  }
}

function checkRequiredFields() {
  let v=true;
  v&=checkField('input-field-title','titleError');
  v&=checkField('input-field-date','dueDateError');
  v&=checkCategory();
  return v;
}

function checkField(id,errId) {
  const inp=document.getElementById(id);
  const err=document.getElementById(errId);
  if(!inp||inp.value.trim()===''){if(err)err.classList.remove('d-none');return false;}
  return true;
}

function checkCategory() {
  const catErr=document.getElementById('categoryError');
  if(currentTaskCategory===''){if(catErr)catErr.classList.remove('d-none');return false;}
  return true;
}

function setPriority() {
  setTimeout(()=>{
    const b=document.querySelector('.task-button.active');
    activePriority=b?b.getAttribute('data-color'):'';
  },10);
}

function setCategory(c) { currentTaskCategory=c; }

function formateDueDate() {
  const val=document.getElementById('input-field-date')?.value;
  dueDate=formatDateToYMD(val);
  if(dueDate==='NaN-NaN-NaN')console.log('lol');
}

function formatDateToYMD(ds) {
  const d=new Date(ds);
  const y=d.getFullYear();
  const m=(d.getMonth()+1).toString().padStart(2,'0');
  const day=d.getDate().toString().padStart(2,'0');
  return `${y}-${m}-${day}`;
}

// Custom Dropdowns ohne DOMContentLoaded
function initCustomDropdowns() {
  const cS=document.querySelectorAll('.add-task-custom-select');
  for(let i=0;i<cS.length;i++) setupCustomSelect(cS[i]);
  setupOutsideClickForCustomSelects(cS);
}

function setupCustomSelect(c) {
  const s=c.querySelector('.select-selected');
  const oC=c.querySelector('.select-items');
  const sId=c.getAttribute('id');
  s.addEventListener('click',()=>{
    oC.classList.toggle('select-hide');
    c.classList.toggle('open');
  });
  addOptionListeners(oC,sId,s,c);
}

function addOptionListeners(oC,sId,s,c) {
  const o=oC.querySelectorAll('.select-option');
  for(let i=0;i<o.length;i++){
    o[i].addEventListener('click',()=>{
      if(sId==='drop-down-2'){
        s.textContent=o[i].textContent;
        oC.classList.add('select-hide');
        c.classList.remove('open');
      }
    });
  }
}

function setupOutsideClickForCustomSelects(cS) {
  document.addEventListener('click',(e)=>{
    for(let i=0;i<cS.length;i++){
      const s=cS[i].querySelector('.select-selected');
      const oC=cS[i].querySelector('.select-items');
      if(!s.contains(e.target)&&!oC.contains(e.target)){
        oC.classList.add('select-hide');
        cS[i].classList.remove('open');
      }
    }
  });
}
