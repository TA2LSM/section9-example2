const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    //--- Sub document olarak ekleme ---
    //author: authorSchema,
    // Embedded (sub) document yöntemi için yukarıda tanımlı şemayı buraya
    // tanımlamak yeterli. Author bir sub document olarak yaratılacak ama
    // sadece ana döküman yaratıldığında. Ayrıca bir yerde tutuluyor olmayacak
    // author: {
    //   type: authorSchema,
    //   required: true,
    // },
    //--- Array olarak ekleme ---
    authors: {
      type: [authorSchema],
      required: true,
    },
  })
);

// Bir tane author ile çalışan kod
// async function createCourse(name, author) {
//   const course = new Course({
//     name,
//     author,
//   });

//   const result = await course.save();
//   console.log(result);
// }

// Birden çok author ile çalışan kod
async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors,
  });

  const result = await course.save();
  console.log(result);
}

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  if (!course) {
    console.log("The course with the given ID is not found!");
    return;
  }

  course.authors.push(author);
  const result = await course.save({ new: true });
  console.log(result);
}

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  if (!course) {
    console.log("The course with the given ID is not found!");
    return;
  }

  const author = course.authors.id(authorId);
  author.remove(); //yukarıdaki fonksiyonun döndüğü author objesini Course içinden kaldırır.

  const result = await course.save({ new: true });
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

async function updateCourse(courseId) {
  // (1) Modify 1
  // const course = await Course.findById(courseId);
  // if (!course) {
  //   console.log("The course with the given ID is not found!");
  //   return;
  // }

  // course.author.name = "TA2LSM (1)";
  // await course.save();

  // (2) Modify 2
  // const course = await Course.findByIdAndUpdate(
  //   courseId,
  //   {
  //     author: { name: "TA2LSM (1)" },
  //   },
  //   { new: true } // değiştirilmiş dökümanı geri döner);
  // );

  // if (!course) {
  //   console.log("The course with the given ID is not found!");
  //   return;
  // } else console.log(course);

  // (3) Modify 3
  const course = await Course.findByIdAndUpdate(
    courseId,
    {
      // $set: {
      //   "author.name": "TA2LSM (5)",
      // },
      $unset: { author: "" },
      //$unset: { "author.name": "" },
    },
    { new: true } // değiştirilmiş dökümanı geri döner);
  );

  if (!course) {
    console.log("The course with the given ID is not found!");
    return;
  } else console.log(course);
}

//createCourse("Node Course", new Author({ name: "TA2LSM" }));
//createCourse("Node Course", [new Author({ name: "TA2LSM" }), new Author({ name: "Other Author" })]);

//addAuthor("6231f687113168bb61409bbd", new Author({ name: "New Author" }));
removeAuthor("6231f687113168bb61409bbd", "6231fae80adc7b19ccdaf621");

//listCourses();

//updateCourse("6231e20a3588d1d29dc8105c");
//updateCourse("6231e20a3588d1d29dc81011");
